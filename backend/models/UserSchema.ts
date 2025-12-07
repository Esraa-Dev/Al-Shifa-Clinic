import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../constants.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  address: { line1: string; line2: string };
  gender: string;
  dob: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerificationToken: string;
  emailVerificationTokenExpiry: Date;
  generateTemporaryToken: () => {
    token: string;
    hashedToken: string;
    tokenExpiry: Date;
  };
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default:
      "data:image/png;base64,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",
  },
  address: { type: Object, default: { line1: "", line2: "" } },
  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  phone: { type: String, default: "00000000000" },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.PATIENT,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationTokenExpiry: {
    type: Date,
  },
});

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  await bcrypt.hash(this.password, 20);
});

UserSchema.methods.isPasswordValid = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateTemporaryToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const tokenExpiry = new Date(Date.now() + 20 * 60 * 1000);
  return { token, hashedToken, tokenExpiry };
};

// UserSchema.method.generateAccessToken = async function () {
//   jwt.sign({
//     name: this.name,
//     _id: this._id,
//     role: this.role,
//     email: this.email,
//   },process.env.JWT_SECRET,{
//     expiresIn:1
//   });
// };

export const registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
    "string.empty": "Confirm password is required",
  }),
  address: Joi.object({
    line1: Joi.string().allow("").optional(),
    line2: Joi.string().allow("").optional(),
  }).optional(),
  gender: Joi.string().valid("male", "female", "Not Selected").optional(),
  dob: Joi.date().iso().optional().messages({
    "date.format": "Date of birth must be in YYYY-MM-DD format",
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
    .optional(),
});
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
