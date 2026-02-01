import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Rating, validateRating } from "../models/RatingSchema.js";
import { Appointment } from "../models/AppointmentSchema.js";
import { Notification } from "../models/NotificationSchema.js";
import { Doctor } from "../models/DoctorSchema.js";
import { getPaginationData } from "../utils/PaginationHelper.js";
import { sendNotification } from "../server.js";

export const createRating = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { error } = validateRating.validate(req.body);
    if (error) {
      throw new ApiError(
        t("rating:validationFailed"),
        400,
        error.details.map((d) => d.message),
      );
    }

    const patientId = req.user?._id;
    const { appointmentId } = req.params;
    const { rating, review } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(t("rating:appointmentNotFound"), 404);
    }

    if (appointment.patientId.toString() !== patientId?.toString()) {
      throw new ApiError(t("rating:unauthorized"), 403);
    }

    if (appointment.status !== "Completed") {
      throw new ApiError(t("rating:appointmentNotCompleted"), 400);
    }

    if (appointment.isRated) {
      throw new ApiError(t("rating:appointmentAlreadyRated"), 400);
    }

    const existingRating = await Rating.findOne({ appointmentId });
    if (existingRating) {
      throw new ApiError(t("rating:ratingAlreadyExists"), 400);
    }

    const newRating = new Rating({
      patientId,
      doctorId: appointment.doctorId,
      appointmentId,
      rating,
      review,
    });

    await newRating.save();

    appointment.isRated = true;
    await appointment.save();

    const doctor = await Doctor.findById(appointment.doctorId);
    if (doctor) {
      const totalReviews = await Rating.countDocuments({
        doctorId: doctor._id,
      });
      const avgRating = await Rating.aggregate([
        { $match: { doctorId: doctor._id } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]);

      doctor.rating = avgRating[0]?.avg || 0;
      doctor.totalReviews = totalReviews;
      await doctor.save();
    }

    const notification = new Notification({
      userId: appointment.doctorId,
      title: "New Rating Received",
      message: `Patient rated you ${rating} stars${review ? " with a review" : ""}`,
      type: "rating",
      relatedId: newRating._id,
    });

    await notification.save();
    sendNotification(appointment.doctorId.toString(), notification);

    res
      .status(201)
      .json(new ApiResponse(t("rating:ratingSubmitted"), newRating, 201));
  },
);

export const getDoctorRatings = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const doctorId = req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    const filter = { doctorId };
    const totalItems = await Rating.countDocuments(filter);
    const pagination = getPaginationData(page, limit, totalItems);

    const ratings = await Rating.find(filter)
      .populate({
        path: "patientId",
        select: "firstName lastName image",
      })
      .populate({
        path: "appointmentId",
        select: "appointmentDate type",
      })
      .sort({ createdAt: -1 })
      .skip((pagination.currentPage - 1) * pagination.limit)
      .limit(pagination.limit);

    res
      .status(200)
      .json(
        new ApiResponse(
          t("rating:ratingsFetched"),
          { ratings, pagination },
          200,
        ),
      );
  },
);

export const getPatientRatings = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const patientId = req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    const filter = { patientId };
    const totalItems = await Rating.countDocuments(filter);
    const pagination = getPaginationData(page, limit, totalItems);

    const ratings = await Rating.find(filter)
      .populate({
        path: "doctorId",
        select: "firstName lastName image specialization_en",
      })
      .populate({
        path: "appointmentId",
        select: "appointmentDate type",
      })
      .sort({ createdAt: -1 })
      .skip((pagination.currentPage - 1) * pagination.limit)
      .limit(pagination.limit);

    res
      .status(200)
      .json(
        new ApiResponse(
          t("rating:ratingsFetched"),
          { ratings, pagination },
          200,
        ),
      );
  },
);

export const deleteRating = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const { id } = req.params;
    const userId = req.user?._id;

    const rating = await Rating.findById(id);
    if (!rating) {
      throw new ApiError(t("rating:ratingNotFound"), 404);
    }

    const appointment = await Appointment.findById(rating.appointmentId);
    if (!appointment) {
      throw new ApiError(t("rating:appointmentNotFound"), 404);
    }

    if (appointment.patientId.toString() !== userId?.toString()) {
      throw new ApiError(t("rating:unauthorized"), 403);
    }

    await rating.deleteOne();

    appointment.isRated = false;
    await appointment.save();

    const doctor = await Doctor.findById(rating.doctorId);
    if (doctor) {
      const totalReviews = await Rating.countDocuments({
        doctorId: doctor._id,
      });
      const avgRating =
        totalReviews > 0
          ? await Rating.aggregate([
              { $match: { doctorId: doctor._id } },
              { $group: { _id: null, avg: { $avg: "$rating" } } },
            ])
          : [{ avg: 0 }];

      doctor.rating = avgRating[0]?.avg || 0;
      doctor.totalReviews = totalReviews;
      await doctor.save();
    }

    res.status(200).json(new ApiResponse(t("rating:ratingDeleted"), null, 200));
  },
);
