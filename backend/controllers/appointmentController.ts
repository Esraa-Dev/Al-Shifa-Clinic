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
import { Patient } from "../models/PatientSchema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken04 } from "../utils/ZegoToken.js";
import { getStripeInstance } from "../utils/stripe.js";
import { getPaginationData } from "../utils/PaginationHelper.js";
import { Notification } from "../models/NotificationSchema.js";

export const getPatientAppointments = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const patientId = req.user?._id;
    const { status, page = 1, limit = 10 } = req.query;
    const filter: any = { patientId: patientId };

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    }

    const totalItems = await Appointment.countDocuments(filter);
    const pagination = getPaginationData(page, limit, totalItems);

    const appointments = await Appointment.find(filter)
      .populate({
        path: "doctorId",
        select:
          "firstName lastName specialization_en specialization_ar image fee",
      })
      .sort({ appointmentDate: -1, startTime: -1 })
      .skip((pagination.currentPage - 1) * pagination.limit)
      .limit(pagination.limit);

    res.status(200).json(
      new ApiResponse(
        t("appointment:appointmentsFetched"),
        {
          appointments,
          pagination,
        },
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDateTime < today) {
      throw new ApiError(t("appointment:pastAppointment"), 400);
    }

    const isToday = appointmentDateTime.toDateString() === today.toDateString();
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

    const patient = await Patient.findById(patientId);
    if (!patient) throw new ApiError(t("appointment:patientNotFound"), 404);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: appointmentDateTime,
      paymentStatus: "paid",
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (existingAppointment) {
      throw new ApiError(t("appointment:timeSlotBooked"), 400);
    }

    const stripeInstance = getStripeInstance();
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(fee * 100),
      currency: "egp",
      metadata: {
        appointmentDate: appointmentDateTime.toISOString(),
        startTime: startTime,
        endTime: endTime,
        patientId: patientId?.toString() || "",
        doctorId: doctorId,
        type: type,
        symptoms: symptoms || "",
        fee: fee.toString(),
      },
    });

    res.status(201).json(
      new ApiResponse(
        t("appointment:paymentRequired"),
        {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
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

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(t("appointment:doctorNotFound"), 404);

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

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(t("appointment:doctorNotFound"), 404);

    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
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
    const { status, page = 1, limit = 10 } = req.query;
    const filter: any = { doctorId: doctorId };

    if (status) {
      const statusArr = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArr };
    }

    const totalItems = await Appointment.countDocuments(filter);
    const pagination = getPaginationData(page, limit, totalItems);

    const appointments = await Appointment.find(filter)
      .populate({
        path: "patientId",
        select: "firstName lastName email phone image",
      })
      .populate({
        path: "doctorId",
        select:
          "firstName lastName specialization_en specialization_ar fee image",
      })
      .sort({ appointmentDate: 1, startTime: 1 })
      .skip((pagination.currentPage - 1) * pagination.limit)
      .limit(pagination.limit);

    res.status(200).json(
      new ApiResponse(
        t("appointment:appointmentsFetched"),
        {
          appointments,
          pagination,
        },
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

    const appointmentDateOnly = new Date(appointment.appointmentDate);
    appointmentDateOnly.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    if (appointmentDateOnly < yesterday) {
      throw new ApiError(t("appointment:cannotModifyPastAppointment"), 400);
    }

    if (appointment.status === "Completed" && status === "Completed") {
      throw new ApiError(t("appointment:appointmentAlreadyCompleted"), 400);
    }

    if (appointment.status === "Cancelled" && status === "Cancelled") {
      throw new ApiError(t("appointment:appointmentAlreadyCancelled"), 400);
    }

    const doctorId = req.user?._id;
    if (doctorId?.toString() !== appointment.doctorId.toString()) {
      throw new ApiError(t("appointment:unauthorized"), 403);
    }

    appointment.status = status;

    if (status === "Cancelled") {
      appointment.paymentStatus = "refunded";
    }

    await appointment.save();

    let notificationMessage = "";
    if (status === "Completed") {
      notificationMessage = t("appointment:appointmentCompleted");
      await Notification.create({
        userId: appointment.patientId,
        title: "Appointment Completed",
        message:
          "Your appointment has been completed. Please rate your experience.",
        type: "appointment",
        relatedId: appointment._id,
      });

      await Notification.create({
        userId: appointment.doctorId,
        title: "Appointment Completed",
        message: "Appointment completed. You can now add prescription.",
        type: "appointment",
        relatedId: appointment._id,
      });
    } else if (status === "Scheduled") {
      notificationMessage = t("appointment:appointmentScheduled");
    } else if (status === "Cancelled") {
      notificationMessage = t("appointment:appointmentCancelled");
    } else if (status === "In Progress") {
      notificationMessage = t("appointment:appointmentInProgress");
    }

    const updatedAppointment = await Appointment.findById(id)
      .populate("patientId", "firstName lastName email phone image")
      .populate("doctorId", "firstName lastName specialization fee image");

    res
      .status(200)
      .json(
        new ApiResponse(
          notificationMessage || t("appointment:statusUpdated"),
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
          appointmentStatus: appointment.status,
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
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    try {
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        let metadata = paymentIntent.metadata;

        if (!metadata || !metadata.appointmentDate) {
          const fullPaymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId);
          metadata = fullPaymentIntent.metadata;
        }

        if (!metadata || !metadata.appointmentDate) {
          return res.status(200).json({ received: true });
        }

        const {
          appointmentDate,
          startTime,
          endTime,
          patientId,
          doctorId,
          type,
          symptoms,
          fee,
        } = metadata;

        let appointmentDateTime;
        if (/^\d+$/.test(appointmentDate)) {
          appointmentDateTime = new Date(parseInt(appointmentDate) * 1000);
        } else {
          appointmentDateTime = new Date(appointmentDate);
        }

        const existingAppointment = await Appointment.findOne({
          doctorId,
          appointmentDate: appointmentDateTime,
          paymentStatus: "paid",
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        });

        if (existingAppointment) {
          await stripe.refunds.create({
            payment_intent: paymentIntentId,
          });
          return res.status(200).json({ received: true });
        }

        const newAppointment = new Appointment({
          patientId,
          doctorId,
          appointmentDate: appointmentDateTime,
          startTime,
          endTime,
          type,
          fee: parseFloat(fee),
          symptoms,
          status: "Scheduled",
          paymentStatus: "paid",
          stripePaymentId: paymentIntentId,
          paymentCompletedAt: new Date(),
          roomId:
            type !== "clinic"
              ? `room_${Math.random().toString(36).substr(2, 9)}`
              : undefined,
        });

        await newAppointment.save();

        await Notification.create({
          userId: doctorId,
          title: "New Appointment Booked",
          message: "A patient has booked an appointment with you",
          type: "appointment",
          relatedId: newAppointment._id,
        });

        await Notification.create({
          userId: patientId,
          title: "Appointment Confirmed",
          message: "Your appointment has been confirmed",
          type: "appointment",
          relatedId: newAppointment._id,
        });
      }

      if (event.type === "payment_intent.payment_failed") {
        return res.status(200).json({ received: true });
      }

      return res.status(200).json({ received: true });
    } catch (error: any) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

export const checkPaymentIntentStatus = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { paymentIntentId } = req.params;

    const stripeInstance = getStripeInstance();
    const paymentIntent =
      await stripeInstance.paymentIntents.retrieve(paymentIntentId);

    let appointment = null;
    if (paymentIntent.status === "succeeded") {
      appointment = await Appointment.findOne({
        stripePaymentId: paymentIntentId,
      });
    }

    res.status(200).json(
      new ApiResponse(
        t("appointment:paymentStatusRetrieved"),
        {
          paymentStatus: paymentIntent.status,
          appointment: appointment,
        },
        200,
      ),
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

    let paymentMessage = "";
    if (appointment.paymentStatus === "paid") {
      paymentMessage = t("appointment:paymentPaid");
    } else if (appointment.paymentStatus === "pending") {
      paymentMessage = t("appointment:paymentPending");
    } else if (appointment.paymentStatus === "failed") {
      paymentMessage = t("appointment:paymentFailed");
    } else if (appointment.paymentStatus === "refunded") {
      paymentMessage = t("appointment:paymentCancelled");
    }

    res.status(200).json(
      new ApiResponse(
        paymentMessage || t("appointment:paymentStatusRetrieved"),
        {
          paymentStatus: appointment.paymentStatus,
          appointmentStatus: appointment.status,
          appointmentId: appointment._id,
          amount: appointment.fee,
        },
        200,
      ),
    );
  },
);
