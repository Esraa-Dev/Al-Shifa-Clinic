import { Request, Response } from "express";
import {
  Appointment,
  validateBookAppointment,
  validateBookedSlots,
  validateStartConsultation,
  validateUpdateAppointmentStatus,
} from "../models/AppointmentSchema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Doctor } from "../models/DoctorSchema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken04 } from "../utils/ZegoToken.js";
import { getStripeInstance } from "../utils/stripe.js";

export const getPatientAppointments = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const patientId = req.user?._id;
    const { status } = req.query;
    const filter: any = { patientId: patientId };

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "doctorId",
        select: "firstName lastName specialization image",
      })
      .sort({ appointmentDate: -1, startTime: -1 });

    res
      .status(200)
      .json(
        new ApiResponse(
          t("appointment:appointmentsFetched"),
          appointments,
          200,
        ),
      );
  },
);

export const bookAppointment = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { error, value } = validateBookAppointment(t).validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, ""),
      );
      throw new ApiError(t("appointment:validationFailed"), 400, messages);
    }

    const patientId = req.user?._id;
    const { doctorId } = req.params;
    const { appointmentDate, startTime, endTime, type, fee, symptoms } = value;

    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDateTime < today) {
      throw new ApiError(t("appointment:pastAppointment"), 400);
    }

    const isToday = appointmentDateTime.getTime() === today.getTime();
    if (isToday) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const [startHour, startMinute] = startTime.split(":").map(Number);

      if (
        startHour < currentHour ||
        (startHour === currentHour && startMinute < currentMinute)
      ) {
        throw new ApiError(t("appointment:pastAppointment"), 400);
      }
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(t("appointment:doctorNotFound"), 404);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: appointmentDateTime,
      status: { $in: ["Scheduled", "In Progress"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (existingAppointment)
      throw new ApiError(t("appointment:timeSlotBooked"), 400);

    const stripeInstance = getStripeInstance();
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(fee * 100),
      currency: "egp",
      metadata: {
        appointmentDate: appointmentDate,
        startTime: startTime,
        patientId: patientId?.toString() || "",
        doctorId: doctorId,
        type: type,
      },
    });

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate: appointmentDateTime,
      startTime,
      endTime,
      type,
      fee,
      symptoms,
      status: "Pending",
      paymentStatus: "pending",
      stripePaymentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
      roomId:
        type !== "clinic"
          ? `room_${Math.random().toString(36).substr(2, 9)}`
          : undefined,
    });

    await newAppointment.save();

    res.status(201).json(
      new ApiResponse(
        t("appointment:appointmentBooked"),
        {
          appointmentId: newAppointment._id,
          clientSecret: paymentIntent.client_secret,
          requiresPayment: true,
        },
        201,
      ),
    );
  },
);

export const getBookedDates = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { doctorId } = req.params;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: thirtyDaysAgo },
      status: { $in: ["Scheduled", "In Progress"] },
    }).select("appointmentDate -_id");

    const bookedDates = [
      ...new Set(
        bookedAppointments.map(
          (apt) => apt.appointmentDate.toISOString().split("T")[0],
        ),
      ),
    ];

    res
      .status(200)
      .json(
        new ApiResponse(t("appointment:bookedDatesFetched"), bookedDates, 200),
      );
  },
);

export const getBookedSlots = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { value, error } = validateBookedSlots(t).validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, ""),
      );
      throw new ApiError(t("appointment:validationFailed"), 400, messages);
    }

    const { doctorId, date } = value;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["Scheduled", "In Progress"] },
    }).select("startTime -_id");

    const bookedSlots = bookedAppointments.map((apt) => apt.startTime);
    res
      .status(200)
      .json(
        new ApiResponse(t("appointment:bookedSlotsFetched"), bookedSlots, 200),
      );
  },
);

export const getDoctorAppointments = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const doctorId = req.user?._id;
    const { status } = req.query;
    const filter: any = { doctorId: doctorId };

    if (status) {
      const statusArr = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArr };
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "patientId",
        select: "firstName lastName email phone image",
      })
      .populate({
        path: "doctorId",
        select: "firstName lastName specialization fee image",
      })
      .sort({ appointmentDate: 1, startTime: 1 });

    res
      .status(200)
      .json(
        new ApiResponse(
          t("appointment:appointmentsFetched"),
          appointments,
          200,
        ),
      );
  },
);

export const updateAppointmentStatus = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { error, value } = validateUpdateAppointmentStatus(t).validate(
      req.body,
      {
        abortEarly: false,
      },
    );

    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, ""),
      );
      throw new ApiError(t("appointment:validationFailed"), 400, messages);
    }

    const { id } = req.params;
    const { status } = value;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new ApiError(t("appointment:appointmentNotFound"), 404);
    }

    const doctorId = req.user?._id;
    if (doctorId?.toString() !== appointment.doctorId.toString()) {
      throw new ApiError(t("appointment:unauthorized"), 403);
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate("patientId", "firstName lastName email phone image")
      .populate("doctorId", "firstName lastName specialization fee image");

    res
      .status(200)
      .json(
        new ApiResponse(
          t("appointment:statusUpdated"),
          updatedAppointment,
          200,
        ),
      );
  },
);

export const startConsultation = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { error, value } = validateStartConsultation(t).validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, ""),
      );
      throw new ApiError(t("appointment:validationFailed"), 400, messages);
    }

    const { id } = req.params;
    const { type } = value;
    const userId = req.user?._id;

    const appointment = await Appointment.findById(id)
      .populate("doctorId", "firstName lastName email image _id")
      .populate("patientId", "firstName lastName email image _id");

    if (!appointment)
      throw new ApiError(t("appointment:appointmentNotFound"), 404);

    if (appointment.type === "clinic") {
      throw new ApiError(t("appointment:clinicCallError"), 400);
    }

    if (appointment.type !== type) {
      throw new ApiError(t("appointment:wrongConsultationType", { type }), 400);
    }

    const isDoctor = appointment.doctorId._id.toString() === userId?.toString();
    const isPatient =
      appointment.patientId._id.toString() === userId?.toString();
    if (!isDoctor && !isPatient)
      throw new ApiError(t("appointment:unauthorized"), 403);

    if (!["Scheduled", "In Progress"].includes(appointment.status)) {
      throw new ApiError(
        t("appointment:cannotStartConsultation", {
          status: appointment.status,
        }),
        400,
      );
    }

    const appId = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET as string;
    if (!appId || isNaN(appId) || !serverSecret)
      throw new ApiError(t("appointment:callServiceError"), 500);

    const token = generateToken04(
      appId,
      userId.toString(),
      serverSecret,
      3600,
      "",
    );

    if (appointment.status === "Scheduled") appointment.status = "In Progress";
    appointment.callStatus = "ringing";
    appointment.callStartedAt = new Date();
    if (!appointment.roomId)
      appointment.roomId = `room_${appointment._id}_${Date.now()}`;

    await appointment.save();

    res.status(200).json(
      new ApiResponse(
        t("appointment:consultationStarted"),
        {
          roomId: appointment.roomId,
          token,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          type: appointment.type,
        },
        200,
      ),
    );
  },
);

export const stripeWebhook = AsyncHandler(
  async (req: Request, res: Response) => {
    const stripe = getStripeInstance();
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      throw new ApiError("Webhook configuration error", 500);
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      throw new ApiError(`Webhook Error: ${err.message}`, 400);
    }

    const paymentIntent = event.data.object as any;
    const stripePaymentId = paymentIntent.id;

    if (event.type === "payment_intent.succeeded") {
      const appointment = await Appointment.findOneAndUpdate(
        { stripePaymentId },
        { paymentStatus: "paid", status: "Scheduled" },
        { new: true },
      );

      if (!appointment) {
        console.error(`Appointment not found for ID: ${stripePaymentId}`);
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      await Appointment.findOneAndUpdate(
        { stripePaymentId },
        { paymentStatus: "failed", status: "Cancelled" },
      );
    }

    res
      .status(200)
      .json(
        new ApiResponse("Webhook processed successfully", { received: true }),
      );
  },
);

export const checkPaymentStatus = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { appointmentId } = req.params;
    const patientId = req.user?._id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: patientId,
    });

    if (!appointment) {
      throw new ApiError(t("appointment:appointmentNotFound"), 404);
    }

    res.status(200).json(
      new ApiResponse(
        t("appointment:paymentStatusRetrieved"),
        {
          paymentStatus: appointment.paymentStatus,
          appointmentStatus: appointment.status,
          appointmentId: appointment._id,
        },
        200,
      ),
    );
  },
);
