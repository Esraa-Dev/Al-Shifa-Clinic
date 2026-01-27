import { Request, Response } from "express";
import { Doctor, validateUpdateDoctorProfile } from "../models/DoctorSchema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { getPaginationData } from "../utils/PaginationHelper.js";
import { Appointment } from "../models/AppointmentSchema.js";

export const getAllDoctors = AsyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      fee,
      experience,
      schedule,
      sortBy,
    } = req.query;

    let filter: any = {};

    if (search && search !== "") {
      const regex = new RegExp(search.toString(), "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { specialization_en: regex },
        { specialization_ar: regex },
      ];
    }

    if (department && department !== "null" && department !== "") {
      filter.department = new mongoose.Types.ObjectId(department.toString());
    }

    if (experience && experience !== "") {
      const value = parseInt(experience.toString());
      if (!isNaN(value)) filter.experience = { $gte: value };
    }

    if (fee && fee !== "") {
      const value = parseInt(fee.toString());
      if (!isNaN(value)) filter.fee = { $lte: value };
    }

    if (schedule && schedule !== "") {
      filter.schedule = { $elemMatch: { day: schedule.toString() } };
    }

    const sortOptions: any = {
      experience: { experience: -1 },
      fee: { fee: 1 },
      name: { firstName: 1, lastName: 1 },
    };
    const sortOption = sortOptions[sortBy?.toString() || "experience"];
    const pageNumber = parseInt(page.toString()) || 1;
    const limitNumber = parseInt(limit.toString()) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const doctors = await Doctor.find(filter)
      .populate("department", "name icon color")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalItems = await Doctor.countDocuments(filter);

    const pagination = getPaginationData(page, limit, totalItems);

    const responseData = {
      doctors,
      pagination,
    };

    res
      .status(200)
      .json(
        new ApiResponse(req.t("doctor:doctorsRetrieved"), responseData, 200),
      );
  },
);

export const getTopDoctors = AsyncHandler(
  async (req: Request, res: Response) => {
    const { limit = 4 } = req.query;

    const topDoctors = await Doctor.find({
      status: "approved",
      isActive: true,
      profileStatus: "completed",
      rating: { $gte: 4 },
    })
      .populate("department", "name icon color")
      .sort({ rating: -1, totalReviews: -1, experience: -1 })
      .limit(Number(limit));

    res
      .status(200)
      .json(
        new ApiResponse(req.t("doctor:topDoctorsRetrieved"), topDoctors, 200),
      );
  },
);

export const getDoctorProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?._id;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      throw new ApiError(req.t("doctor:doctorNotFound"), 404);
    }
    res
      .status(200)
      .json(new ApiResponse(req.t("doctor:doctorProfileFetched"), doctor, 200));
  },
);

export const updateDoctorProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(req.t("doctor:unauthorizedAccess"), 401);
    }

    const currentDoctor = await Doctor.findById(userId);
    if (!currentDoctor) {
      throw new ApiError(req.t("doctor:doctorNotFound"), 404);
    }

    const { error } = validateUpdateDoctorProfile(req.t).validate(req.body);
    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, ""),
      );
      throw new ApiError(req.t("doctor:validationFailed"), 400, messages);
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        profileStatus: "completed",
      },
      {
        new: true,
      },
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          req.t("doctor:doctorProfileUpdated"),
          updatedDoctor,
          200,
        ),
      );
  },
);

export const getDoctorById = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      throw new ApiError(req.t("doctor:doctorNotFound"), 404);
    }
    res
      .status(200)
      .json(new ApiResponse(req.t("doctor:doctorFetched"), doctor, 200));
  },
);

export const updateDoctorStatus = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new ApiError(req.t("doctor:validationFailed"), 400);
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!doctor) {
      throw new ApiError(req.t("doctor:doctorNotFound"), 404);
    }

    res
      .status(200)
      .json(new ApiResponse(req.t("doctor:doctorStatusUpdated"), doctor, 200));
  },
);

export const toggleDoctorActiveStatus = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );

    if (!doctor) {
      throw new ApiError(req.t("doctor:doctorNotFound"), 404);
    }

    const message = isActive
      ? req.t("doctor:doctorActivated")
      : req.t("doctor:doctorDeactivated");

    res.status(200).json(new ApiResponse(message, doctor, 200));
  },
);

export const updateProfileStatus = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { profileStatus } = req.body;

    if (!["incomplete", "completed"].includes(profileStatus)) {
      throw new ApiError(req.t("doctor:validationFailed"), 400);
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { profileStatus },
      { new: true },
    );

    if (!doctor) {
      throw new ApiError(req.t("doctor:doctorNotFound"), 404);
    }

    res
      .status(200)
      .json(new ApiResponse(req.t("doctor:profileStatusUpdated"), doctor, 200));
  },
);

export const getDoctorStats = AsyncHandler(
  async (req: Request, res: Response) => {
    const doctorId = req.user?._id;
    if (!doctorId) {
      throw new ApiError("Unauthorized", 401);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statsSummary = await Appointment.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalAppointments: { $sum: 1 },
                totalRevenue: {
                  $sum: {
                    $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$fee", 0],
                  },
                },
                onlineConsultations: {
                  $sum: {
                    $cond: [{ $in: ["$type", ["video", "voice"]] }, 1, 0],
                  },
                },
                clinicConsultations: {
                  $sum: { $cond: [{ $eq: ["$type", "clinic"] }, 1, 0] },
                },
                cancelledAppointments: {
                  $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
                },
              },
            },
          ],
          recentAppointments: [
            { $sort: { appointmentDate: -1, startTime: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "users",
                localField: "patientId",
                foreignField: "_id",
                as: "patient",
              },
            },
            { $unwind: "$patient" },
            {
              $project: {
                patientName: {
                  $concat: ["$patient.firstName", " ", "$patient.lastName"],
                },
                patientPhone: "$patient.phone",
                date: "$appointmentDate",
                time: "$startTime",
                mode: "$type",
                status: "$status",
                consultationFees: "$fee",
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    const totals = statsSummary[0]?.totals[0] || {
      totalAppointments: 0,
      totalRevenue: 0,
      onlineConsultations: 0,
      clinicConsultations: 0,
      cancelledAppointments: 0,
    };

    const recentAppointments = statsSummary[0]?.recentAppointments || [];

    const stats = {
      ...totals,
      recentAppointments,
    };

    res
      .status(200)
      .json(new ApiResponse("Doctor stats fetched successfully", stats, 200));
  },
);
