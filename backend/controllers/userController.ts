import { Request, Response } from "express";
import User, { registerValidation } from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { emailVerificationContent, sendEmail } from "../utils/email.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error } = registerValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      throw new ApiError("Validation failed", 400, error.details);
    }

    const { name, email, password, address, gender, dob, phone, role } =
      req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw new ApiError("User already exists", 400);
    }

    const newUser = await User.create({
      name,
      email,
      password,
      address,
      gender,
      dob,
      phone,
      role,
      isEmailVerified: false,
    });

    const { token, hashedToken, tokenExpiry } =
      newUser.generateTemporaryToken();
    newUser.emailVerificationToken = hashedToken;
    newUser.emailVerificationTokenExpiry = tokenExpiry;
    await newUser.save({ validateBeforeSave: false });

    const mailgenContent = await emailVerificationContent(
      name,
      `${process.env.FRONTEND_URL}/verify-email/${token}`
    );
    await sendEmail({
      email: newUser.email,
      subject: "تأكيد البريد الإلكتروني",
      mailgenContent,
    });

    res.status(201).json(
      new ApiResponse(
        "User registered successfully and verification email has been sent",
        201
      )
    );
  }
);

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
