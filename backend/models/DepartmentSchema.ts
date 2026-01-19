import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  icon?: string;
  isActive: boolean;
}

const DepartmentSchema: Schema = new Schema({
  name_en: {
    type: String,
    required: true,
    trim: true,
  },
  name_ar: {
    type: String,
    required: true,
    trim: true,
  },
  description_en: {
    type: String,
  },
  description_ar: {
    type: String,
  },
  icon: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { 
  timestamps: true 
});

export const Department = mongoose.model<IDepartment>("Department", DepartmentSchema);