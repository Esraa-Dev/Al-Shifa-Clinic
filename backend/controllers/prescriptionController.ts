import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  Prescription,
  validatePrescription,
} from "../models/PrescriptionSchema.js";
import { Appointment } from "../models/AppointmentSchema.js";
import { Notification } from "../models/NotificationSchema.js";
import { getPaginationData } from "../utils/PaginationHelper.js";

export const createPrescription = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { error } = validatePrescription.validate(req.body);
    if (error) {
      throw new ApiError(
        t("prescription:validationFailed"),
        400,
        error.details.map((d) => d.message),
      );
    }

    const doctorId = req.user?._id;
    const { appointmentId } = req.params;
    const { diagnosis, medicines, notes, followUpDate } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(t("appointment:appointmentNotFound"), 404);
    }

    if (appointment.doctorId.toString() !== doctorId?.toString()) {
      throw new ApiError(t("common:unauthorized"), 403);
    }

    if (appointment.status !== "Completed") {
      throw new ApiError(t("prescription:appointmentNotCompleted"), 400);
    }

    const existingPrescription = await Prescription.findOne({ appointmentId });
    if (existingPrescription) {
      throw new ApiError(t("prescription:prescriptionAlreadyExists"), 400);
    }

    const prescription = new Prescription({
      doctorId,
      patientId: appointment.patientId,
      appointmentId,
      diagnosis,
      medicines,
      notes,
      followUpDate,
    });

    await prescription.save();

    appointment.hasPrescription = true;
    await appointment.save();

    await Notification.create({
      userId: appointment.patientId,
      title: "New Prescription",
      message: "Doctor has prescribed medications for your appointment",
      type: "prescription",
      relatedId: prescription._id,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          t("prescription:prescriptionCreated"),
          prescription,
          201,
        ),
      );
  },
);

export const getPrescriptions = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const userId = req.user?._id;
    const { role } = req.user!;
    const { page = 1, limit = 10 } = req.query;

    const filter =
      role === "doctor" ? { doctorId: userId } : { patientId: userId };
    const totalItems = await Prescription.countDocuments(filter);
    const pagination = getPaginationData(page, limit, totalItems);

    const prescriptions = await Prescription.find(filter)
      .populate({
        path: role === "doctor" ? "patientId" : "doctorId",
        select: "firstName lastName image specialization_en",
      })
      .populate({
        path: "appointmentId",
        select: "appointmentDate symptoms",
      })
      .sort({ createdAt: -1 })
      .skip((pagination.currentPage - 1) * pagination.limit)
      .limit(pagination.limit);

    res
      .status(200)
      .json(
        new ApiResponse(
          t("prescription:prescriptionsFetched"),
          { prescriptions, pagination },
          200,
        ),
      );
  },
);

export const getPrescriptionById = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { id } = req.params;
    const userId = req.user?._id;
    const { role } = req.user!;

    const prescription = await Prescription.findById(id)
      .populate({
        path: "patientId",
        select: "firstName lastName dateOfBirth gender bloodGroup",
      })
      .populate({
        path: "doctorId",
        select: "firstName lastName specialization_en qualification_en",
      })
      .populate({
        path: "appointmentId",
        select: "appointmentDate symptoms type",
      });

    if (!prescription) {
      throw new ApiError(t("prescription:prescriptionNotFound"), 404);
    }

    if (
      (role === "doctor" &&
        prescription.doctorId.toString() !== userId?.toString()) ||
      (role === "patient" &&
        prescription.patientId.toString() !== userId?.toString())
    ) {
      throw new ApiError(t("prescription:unauthorizedAccess"), 403);
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          t("prescription:prescriptionFetched"),
          prescription,
          200,
        ),
      );
  },
);

export const getPrescriptionByAppointmentId = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { appointmentId } = req.params;
    const userId = req.user?._id;

    const prescription = await Prescription.findOne({ appointmentId })
      .populate({
        path: "patientId",
        select: "firstName lastName dateOfBirth gender bloodGroup",
      })
      .populate({
        path: "doctorId",
        select: "firstName lastName specialization_en qualification_en",
      })
      .populate({
        path: "appointmentId",
        select: "appointmentDate symptoms type",
      });

    if (!prescription) {
      throw new ApiError(t("prescription:prescriptionNotFound"), 404);
    }
    
    res
      .status(200)
      .json(
        new ApiResponse(
          t("prescription:prescriptionFetched"),
          prescription,
          200,
        ),
      );
  },
);

export const updatePrescription = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { error } = validatePrescription.validate(req.body);
    if (error) {
      throw new ApiError(
        t("prescription:validationFailed"),
        400,
        error.details.map((d) => d.message),
      );
    }

    const doctorId = req.user?._id;
    const { id } = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      throw new ApiError(t("prescription:prescriptionNotFound"), 404);
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      req.body,
      { new: true },
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          t("prescription:prescriptionUpdated"),
          updatedPrescription,
          200,
        ),
      );
  },
);

export const deletePrescription = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const doctorId = req.user?._id;
    const { id } = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      throw new ApiError(t("prescription:prescriptionNotFound"), 404);
    }

    if (prescription.doctorId.toString() !== doctorId?.toString()) {
      throw new ApiError(t("common:unauthorized"), 403);
    }

    await Appointment.findByIdAndUpdate(prescription.appointmentId, {
      hasPrescription: false,
    });

    await prescription.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(t("prescription:prescriptionDeleted"), null, 200));
  },
);