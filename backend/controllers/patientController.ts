import { Request, Response } from "express";
import { Patient, updateProfileSchema } from "../models/PatientSchema";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

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
