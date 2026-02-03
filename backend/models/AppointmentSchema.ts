import Joi from "joi";
import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: "Pending" | "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  type: "video" | "voice" | "clinic";
  fee: number;
  symptoms?: string;
  roomId: string;
  callStatus: "idle" | "ringing" | "connected" | "ended";
  callStartedAt?: Date;
  callEndedAt?: Date;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  stripePaymentId?: string;
  stripeClientSecret?: string;
  hasPrescription?: boolean;
  isRated?: boolean;
}

const AppointmentSchema: Schema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    type: {
      type: String,
      enum: ["video", "voice", "clinic"],
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    symptoms: {
      type: String,
    },
    roomId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    callStatus: {
      type: String,
      enum: ["idle", "ringing", "connected", "ended"],
      default: "idle",
    },
    callStartedAt: {
      type: Date,
    },
    callEndedAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripePaymentId: {
      type: String,
    },
    stripeClientSecret: {
      type: String,
    },
    isRated: {
      type: Boolean,
      default: false,
    },
    hasPrescription: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const validateBookAppointment = (t: any) =>
  Joi.object({
    appointmentDate: Joi.date()
      .iso()
      .required()
      .messages({
        "any.required": t("appointment:appointmentDateRequired"),
        "date.format": t("appointment:dateFormat"),
      }),
    startTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required()
      .messages({
        "any.required": t("appointment:startTimeRequired"),
        "string.pattern.base": t("appointment:timeFormat"),
      }),
    endTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required()
      .messages({
        "any.required": t("appointment:endTimeRequired"),
        "string.pattern.base": t("appointment:timeFormat"),
      }),
    type: Joi.string()
      .valid("clinic", "video", "voice")
      .default("clinic")
      .messages({
        "any.only": t("appointment:typeRequired"),
      }),
    fee: Joi.number()
      .positive()
      .required()
      .messages({
        "any.required": t("appointment:feeRequired"),
        "number.base": t("appointment:feeRequired"),
        "number.positive": t("appointment:feePositive"),
      }),
    symptoms: Joi.string().optional(),
  });

export const validateBookedSlots = (t: any) =>
  Joi.object({
    doctorId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        "any.required": t("appointment:doctorIdRequired"),
        "string.hex": t("appointment:doctorIdFormat"),
        "string.length": t("appointment:doctorIdFormat"),
      }),
    date: Joi.date()
      .iso()
      .required()
      .messages({
        "any.required": t("appointment:dateRequired"),
        "date.format": t("appointment:dateFormat"),
      }),
  });

export const validateUpdateAppointmentStatus = (t: any) =>
  Joi.object({
    status: Joi.string()
      .valid("Scheduled", "Completed", "Cancelled", "In Progress")
      .required()
      .messages({
        "any.required": t("appointment:statusRequired"),
        "any.only": t("appointment:statusValid"),
      }),
  });

export const validateStartConsultation = (t: any) =>
  Joi.object({
    type: Joi.string()
      .valid("video", "voice")
      .required()
      .messages({
        "any.required": t("appointment:typeRequired"),
        "any.only": t("appointment:typeRequired"),
      }),
  });

export const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema,
);
