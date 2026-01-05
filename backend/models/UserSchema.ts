import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AccessTokenExpire,
  RefreshTokenExpire,
  UserRole,
} from "../constants.js";
import Joi from "joi";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image?: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  verifyOtp?: string;
  verifyOtpExpireAt?: Date;
  resetPasswordOtp?: string;
  resetPasswordOtpExpireAt?: Date;
  refreshToken?: string;
  isActive: boolean;
  profileStatus?: string;
  isPasswordValid(password: string): Promise<boolean>;
  generateOtp(type: string): string;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.PATIENT,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtp: {
      type: String,
    },
    verifyOtpExpireAt: {
      type: Date,
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordOtpExpireAt: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { discriminatorKey: "role", timestamps: true }
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.isPasswordValid = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateOtp = function (type = "verification") {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (type === "verification") {
    this.verifyOtp = otp;
    this.verifyOtpExpireAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  } else if (type === "reset") {
    this.resetPasswordOtp = otp;
    this.resetPasswordOtpExpireAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  }

  return otp;
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: AccessTokenExpire }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: RefreshTokenExpire }
  );
};

export const registerValidation = Joi.object({
  firstName: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),
  lastName: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
    "string.empty": "Confirm password is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9+]+$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.pattern.base": "Phone must contain only numbers and +",
      "string.empty": "Phone is required",
    }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.PATIENT)
    .messages({
      "any.only": "Role must be one of: patient, doctor",
    }),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
});

export const verifyResetOtpValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  resetPasswordOtp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
    }),
});

export const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
    "string.empty": "Confirm password is required",
  }),
});

export const resendOtpValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  type: Joi.string()
    .valid("reset", "verification")
    .required()
    .messages({
      "any.only": "Type must be either reset or verification",
    }),
});

export const User = mongoose.model<IUser>("User", UserSchema);

export default User;
