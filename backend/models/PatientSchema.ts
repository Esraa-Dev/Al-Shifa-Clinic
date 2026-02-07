import mongoose, { Schema } from "mongoose";
import { User, IUser } from "./UserSchema.js";
import {
  UserRole,
  Gender,
  BloodGroup,
  EmergencyRelationship,
} from "../constants.js";
import Joi from "joi";

export interface IPatient extends IUser {
  dateOfBirth: Date;
  gender: string;
  bloodGroup: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryDoctor?: mongoose.Types.ObjectId;
  medicalHistory: string;
  allergies: string[];
  status: "active" | "inactive";
}

const PatientSchema: Schema = new Schema(
  {
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: null,
    },
    bloodGroup: {
      type: String,
      enum: Object.values(BloodGroup),
      default: BloodGroup.UNKNOWN,
    },
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      pincode: { type: String, default: null },
    },
    emergencyContact: {
      name: { type: String, default: null },
      relationship: {
        type: String,
        enum: Object.values(EmergencyRelationship),
        default: null,
      },
      phone: { type: String, default: null },
    },
    primaryDoctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    medicalHistory: {
      type: String,
      default: null,
    },
    allergies: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

export const getUpdateProfileSchema = (t: any) => {
  return Joi.object({
    firstName: Joi.string().min(3).max(50),
    lastName: Joi.string().min(3).max(50),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/),
    dateOfBirth: Joi.date()
      .iso()
      .max("now")
      .allow("", null)
      .messages({
        "date.format": t("validation:dateOfBirthInvalid"),
      }),
    gender: Joi.string()
      .valid(...Object.values(Gender))
      .allow("", null)
      .messages({
        "any.only": t("validation:genderInvalid"),
      }),
    bloodGroup: Joi.string()
      .valid(...Object.values(BloodGroup))
      .allow("", null)
      .messages({
        "any.only": t("validation:bloodGroupInvalid"),
      }),
    address: Joi.object({
      street: Joi.string()
        .allow("", null)
        .messages({
          "string.base": t("validation:streetInvalid"),
        }),
      city: Joi.string()
        .allow("", null)
        .messages({
          "string.base": t("validation:cityInvalid"),
        }),
      state: Joi.string()
        .allow("", null)
        .messages({
          "string.base": t("validation:stateInvalid"),
        }),
      country: Joi.string()
        .allow("", null)
        .messages({
          "string.base": t("validation:countryInvalid"),
        }),
      pincode: Joi.string()
        .allow("", null)
        .messages({
          "string.base": t("validation:pincodeInvalid"),
        }),
    }),
    emergencyContact: Joi.object({
      name: Joi.string()
        .allow("", null)
        .messages({
          "string.base": t("validation:emergencyNameInvalid"),
        }),
      relationship: Joi.string()
        .valid(...Object.values(EmergencyRelationship))
        .allow("", null)
        .messages({
          "any.only": t("validation:emergencyRelationshipInvalid"),
        }),
      phone: Joi.string()
        .allow("", null)
        .messages({
          "string.base": t("validation:emergencyPhoneInvalid"),
        }),
    }).allow(null),
    medicalHistory: Joi.string()
      .max(2000)
      .allow("", null)
      .messages({
        "string.max": t("validation:medicalHistoryInvalid"),
      }),
    allergies: Joi.array()
      .items(Joi.string())
      .default([])
      .messages({
        "array.includes": t("validation:allergyInvalid"),
      }),
  });
};

export const getUpdateProfileImageValidation = (t: any) => {
  return Joi.object({
    file: Joi.object({
      mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "image/jpg", "image/webp")
        .messages({
          "any.only": t("validation:profileImageType"),
        }),
      size: Joi.number()
        .max(2 * 1024 * 1024)
        .messages({
          "number.max": t("validation:profileImageSize"),
        }),
    })
      .unknown(true)
      .required()
      .messages({
        "any.required": t("validation:profileImageRequired"),
      }),
  });
};

export const Patient = User.discriminator<IPatient>(
  UserRole.PATIENT,
  PatientSchema,
);
