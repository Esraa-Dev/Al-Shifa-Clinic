import { Request, Response } from "express";
import {
  Patient,
  updateProfileImage,
  updateProfileSchema,
} from "../models/PatientSchema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import { cloudinaryUploadImage } from "../utils/cloudinary.js";
export const getPatientProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const _id = req.user?._id;
    const patient = await Patient.findById(_id).select(
      "-password -refreshToken -verifyOtp -resetPasswordOtp -isEmailVerified -role -isActive -__v"
    );

    res
      .status(200)
      .json(
        new ApiResponse("Patient profile retrieved Successfully", patient, 200)
      );
  }
);

export const updateProfileInfo = AsyncHandler(
  async (req: Request, res: Response) => {
    const _id = req.user?._id;
    const { error } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => {
        return err.message.replace(/["]/g, "");
      });
      throw new ApiError("Validation failed", 400, messages);
    }

    const patient = await Patient.findByIdAndUpdate(
      _id,
      { $set: req.body },
      { new: true }
    ).select(
      "-password -refreshToken -verifyOtp -resetPasswordOtp -isEmailVerified -role -isActive -__v"
    );
    res
      .status(200)
      .json(new ApiResponse("Profile updated Successfully", patient, 200));
  }
);

export const uploadProfileImage = AsyncHandler(
  async (req: Request, res: Response) => {
    const _id = req.user?._id;
    if (!req.file) {
      throw new ApiError("Validation failed", 400, [
        "Profile image is required",
      ]);
    }
    const { error } = updateProfileImage.validate(
      { file: req.file },
      { abortEarly: false }
    );
    if (error) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    if (error) {
      const messages = error.details.map((err) => {
        return err.message.replace(/["]/g, "");
      });
      throw new ApiError("Validation failed", 400, messages);
    }
    const result = await cloudinaryUploadImage(req.file.path);

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    const patient = await Patient.findByIdAndUpdate(
      _id,
      { $set: { image: result.secure_url } },
      { new: true }
    ).select(
      "-password -refreshToken -verifyOtp -resetPasswordOtp -isEmailVerified -role -isActive -__v"
    );

    res
      .status(200)
      .json(
        new ApiResponse("Profile image updated successfully", patient, 200)
      );
  }
);
