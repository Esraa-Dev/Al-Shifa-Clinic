import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import User from "../models/UserSchema.js";
import { Department } from "../models/DepartmentSchema.js";
import { Appointment } from "../models/AppointmentSchema.js";
import { Doctor } from "../models/DoctorSchema.js";

export const getHomeStats = AsyncHandler(
  async (_req: Request, res: Response) => {
    const doctorsCount = await User.countDocuments({
      role: "doctor",
      status: "approved",
      isActive: true,
    });

    const departmentsCount = await Department.countDocuments({
      isActive: true,
    });

    const completedAppointments = await Appointment.countDocuments({
      status: "Completed",
    });

    const ratingStats = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const average = ratingStats.length > 0 ? ratingStats[0].avgRating : 4.9;
    const satisfactionRate = Math.round(average * 20);

    res.status(200).json({
      success: true,
      message: "Stats retrieved successfully",
      data: {
        doctors: doctorsCount,
        specialties: departmentsCount,
        appointments: completedAppointments,
        satisfaction: satisfactionRate,
      },
    });
  }
);