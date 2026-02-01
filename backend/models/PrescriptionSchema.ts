import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

export interface IPrescription extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  notes?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema: Schema = new Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medicines: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        instructions: {
          type: String,
        },
      },
    ],
    notes: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const validatePrescription = Joi.object({
  diagnosis: Joi.string().required(),
  medicines: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      dosage: Joi.string().required(),
      frequency: Joi.string().required(),
      duration: Joi.string().required(),
      instructions: Joi.string().allow(""),
    })
  ).min(1).required(),
  notes: Joi.string().allow(""),
  followUpDate: Joi.date().optional(),
});

export const Prescription = mongoose.model<IPrescription>("Prescription", PrescriptionSchema);