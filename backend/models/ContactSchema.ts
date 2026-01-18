import mongoose, { Schema, Document, Types, HydratedDocument } from "mongoose";
import Joi from "joi";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export type ContactDocument = HydratedDocument<IContact>;

export const validateSendMessage = (t: any) => {
  return Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "any.required": t("contact:nameRequired"),
        "string.empty": t("contact:nameRequired"),
        "string.min": t("contact:nameMin"),
        "string.max": t("contact:nameMax"),
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "any.required": t("contact:emailRequired"),
        "string.empty": t("contact:emailRequired"),
        "string.email": t("contact:emailInvalid"),
      }),
    phone: Joi.string()
      .required()
      .messages({
        "any.required": t("contact:phoneRequired"),
        "string.empty": t("contact:phoneRequired"),
      }),
    subject: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages({
        "any.required": t("contact:subjectRequired"),
        "string.empty": t("contact:subjectRequired"),
        "string.min": t("contact:subjectMin"),
      }),
    message: Joi.string()
      .min(10)
      .required()
      .messages({
        "any.required": t("contact:messageRequired"),
        "string.empty": t("contact:messageRequired"),
        "string.min": t("contact:messageMin"),
      }),
  });
};

export const Contact = mongoose.model<IContact>("Contact", ContactSchema);