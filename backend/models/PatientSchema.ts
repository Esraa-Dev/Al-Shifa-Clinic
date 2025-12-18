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
    address1: string;
    address2?: string;
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
  medicalHistory?: string;
  allergies?: string[];
  status: "active" | "inactive";
}

const PatientSchema: Schema = new Schema({
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
    address1: { type: String, default: null },
    address2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    pincode: { type: String, default: null },
  },

  emergencyContact: {
    name: { type: String, default: null },
    relationship: {
      type: Object.values(EmergencyRelationship),
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
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/),
  dateOfBirth: Joi.date().iso(),
  gender: Joi.string().valid(...Object.values(Gender)),
  bloodGroup: Joi.string().valid(...Object.values(BloodGroup)),

  address: Joi.object({
    address1: Joi.string().allow("", null),
    address2: Joi.string().allow("", null),
    city: Joi.string().allow("", null),
    state: Joi.string().allow("", null),
    country: Joi.string().allow("", null),
    pincode: Joi.string().allow("", null),
  }),

  emergencyContact: Joi.object({
    name: Joi.string().allow("", null),
    relationship: Joi.string()
      .valid(...Object.values(EmergencyRelationship))
      .allow("", null),
    phone: Joi.string().allow("", null),
  }).allow(null),

  medicalHistory: Joi.string().allow("", null),
  allergies: Joi.array().items(Joi.string()).default([]),
});

export const Patient = User.discriminator<IPatient>(
  UserRole.PATIENT,
  PatientSchema
);
