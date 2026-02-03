import mongoose, { Schema } from "mongoose";
import { User, IUser } from "./UserSchema.js";
import { UserRole } from "../constants.js";
import Joi from "joi";

export interface IDoctor extends IUser {
  department?: mongoose.Types.ObjectId;
  specialization_en?: string;
  specialization_ar?: string;
  qualification_en?: string;
  qualification_ar?: string;
  experience?: number;
  fee?: number;
  description_en?: string;
  description_ar?: string;
  schedule?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  rating?: number;
  totalReviews?: number;
  profileStatus?: "incomplete" | "completed";
  status?: "pending" | "approved" | "rejected";
  isActive: boolean;
}

const DoctorSchema: Schema = new Schema(
  {
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    specialization_en: { type: String, trim: true, default: "" },
    specialization_ar: { type: String, trim: true, default: "" },
    qualification_en: { type: String, trim: true, default: "" },
    qualification_ar: { type: String, trim: true, default: "" },
    experience: { type: Number, min: 0, default: 0 },
    fee: { type: Number, min: 0, default: 0 },
    description_en: { type: String, default: "" },
    description_ar: { type: String, default: "" },
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    profileStatus: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const validateUpdateDoctorProfile = (t: any) => {
  return Joi.object({
    department: Joi.string().required(),
    specialization_en: Joi.string().required(),
    specialization_ar: Joi.string().required(),
    qualification_en: Joi.string().required(),
    qualification_ar: Joi.string().required(),
    experience: Joi.number().min(0).max(50).required(),
    fee: Joi.number().min(0).required(),
    description_en: Joi.string().max(2000).allow(""),
    description_ar: Joi.string().max(2000).allow(""),
    schedule: Joi.array()
      .items(
        Joi.object({
          day: Joi.string()
            .valid(
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            )
            .required(),
          startTime: Joi.string().required(),
          endTime: Joi.string().required(),
        }),
      )
      .min(1)
      .required()
      .custom((value, helpers) => {
        const days = value.map((item: any) => item.day);
        const uniqueDays = new Set(days);
        if (uniqueDays.size !== days.length) {
          return helpers.error("any.duplicate");
        }
        return value;
      }, "Duplicate days validation")
      .message(t("validation:duplicateDays")),
  });
};

export const validateUpdateDoctorInfo = Joi.object({
  department: Joi.string().allow("").optional(),
  specialization_en: Joi.string().allow(""),
  specialization_ar: Joi.string().allow(""),
  qualification_en: Joi.string().allow(""),
  qualification_ar: Joi.string().allow(""),
  experience: Joi.number().min(0).max(50),
  fee: Joi.number().min(0),
  description_en: Joi.string().allow(""),
  description_ar: Joi.string().allow(""),
  schedule: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid(
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          )
          .required(),
        startTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .required(),
        endTime: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .required(),
      }),
    )
    .optional(),
});

export const validateDoctorImage = Joi.object({
  file: Joi.object({
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/jpg", "image/webp")
      .messages({
        "any.only": "Only JPEG, PNG, JPG or WebP images are allowed",
      }),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .messages({
        "number.max": "Profile image must be less than or equal to 5 MB",
      }),
  })
    .unknown(true)
    .required()
    .messages({
      "any.required": "Profile image is required",
    }),
});

export const Doctor = User.discriminator<IDoctor>(
  UserRole.DOCTOR,
  DoctorSchema,
);