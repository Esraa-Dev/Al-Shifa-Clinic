import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/AppointmentSchema.js";
import User from "../models/UserSchema.js";

export const getDashboardStats = AsyncHandler(
  async (_req: Request, res: Response) => {
    const today = new Date();
    const dayName = today
      .toLocaleString("en-us", { weekday: "long" })
      .toLowerCase();

    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      revenueResult,
      appointmentStats,
      departmentStats,
      allAppointments,
      doctorsStatus,
      topPatients,
    ] = await Promise.all([
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$fee" } } },
      ]),
      Appointment.aggregate([
        {
          $group: {
            _id: { month: { $month: "$appointmentDate" }, status: "$status" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            status: "$_id.status",
            count: 1,
          },
        },
        { $sort: { month: 1 } },
      ]),
      Appointment.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctor",
          },
        },
        { $unwind: "$doctor" },
        {
          $lookup: {
            from: "departments",
            localField: "doctor.department",
            foreignField: "_id",
            as: "dept",
          },
        },
        { $unwind: "$dept" },
        { $group: { _id: "$dept.name_en", patientCount: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", count: "$patientCount" } },
        { $sort: { count: -1 } },
        { $limit: 3 },
      ]),
      Appointment.find()
        .populate("patientId", "firstName lastName image")
        .populate("doctorId", "firstName lastName specialization_en")
        .sort({ createdAt: -1 })
        .limit(10),
      User.aggregate([
        { $match: { role: "doctor" } },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            specialization_en: 1,
            image: 1,
            isAvailableToday: {
              $in: [dayName, { $ifNull: ["$schedule.day", []] }],
            },
          },
        },
      ]),
      Appointment.aggregate([
        {
          $group: {
            _id: "$patientId",
            appointmentCount: { $sum: 1 },
          },
        },
        { $sort: { appointmentCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "patientInfo",
          },
        },
        { $unwind: "$patientInfo" },
        {
          $project: {
            _id: 0,
            id: "$_id",
            firstName: "$patientInfo.firstName",
            lastName: "$patientInfo.lastName",
            image: "$patientInfo.image",
            count: "$appointmentCount",
          },
        },
      ]),
    ]);

    const availableCount = doctorsStatus.filter(
      (d) => d.isAvailableToday,
    ).length;

    const stats = {
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalRevenue:
        revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0,
      appointmentStats,
      departmentStats,
      allAppointments,
      doctorsStatus: {
        available: availableCount,
        unavailable: doctorsStatus.length - availableCount,
        list: doctorsStatus,
      },
      topPatients,
    };

    res
      .status(200)
      .json(new ApiResponse("Dashboard stats fetched", stats, 200));
  },
);
