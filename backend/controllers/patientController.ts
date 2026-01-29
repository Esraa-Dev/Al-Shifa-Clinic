import { Request, Response } from "express";
import {
  Patient,
  getUpdateProfileSchema,
  getUpdateProfileImageValidation,
} from "../models/PatientSchema.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import { cloudinaryUploadImage } from "../utils/cloudinary.js";

export const getPatientProfile = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const _id = req.user?._id;
    const patient = await Patient.findById(_id).select(
      "-password -refreshToken -verifyOtp -resetPasswordOtp -isEmailVerified -role -isActive -__v",
    );

    res
      .status(200)
      .json(new ApiResponse(t("validation:profileRetrieved"), patient, 200));
  },
);

export const updateProfileInfo = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const _id = req.user?._id;
    const { error } = getUpdateProfileSchema(t).validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => {
        return err.message.replace(/["]/g, "");
      });
      throw new ApiError(t("validation:validationFailed"), 400, messages);
    }

    const patient = await Patient.findByIdAndUpdate(
      _id,
      { $set: req.body },
      { new: true },
    ).select(
      "-password -refreshToken -verifyOtp -resetPasswordOtp -isEmailVerified -role -isActive -__v",
    );

    res
      .status(200)
      .json(new ApiResponse(t("validation:profileUpdated"), patient, 200));
  },
);

export const uploadProfileImage = AsyncHandler(
  async (req: Request, res: Response) => {
    const t = req.t;
    const _id = req.user?._id;

    if (!req.file) {
      throw new ApiError(t("validation:imageRequired"), 400);
    }

    const { error } = getUpdateProfileImageValidation(t).validate(
      { file: req.file },
      { abortEarly: false },
    );

    if (error) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      const messages = error.details.map((err) => {
        return err.message.replace(/["]/g, "");
      });
      throw new ApiError(t("validation:validationFailed"), 400, messages);
    }

    const result = await cloudinaryUploadImage(req.file.path);

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const patient = await Patient.findByIdAndUpdate(
      _id,
      { $set: { image: result.secure_url } },
      { new: true },
    ).select(
      "-password -refreshToken -verifyOtp -resetPasswordOtp -isEmailVerified -role -isActive -__v",
    );

    res
      .status(200)
      .json(new ApiResponse(t("validation:imageUploaded"), patient, 200));
  },
);
