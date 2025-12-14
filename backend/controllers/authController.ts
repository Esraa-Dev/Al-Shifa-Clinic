import { Request, Response } from "express";
import User, {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  verifyResetOtpValidation,
  resetPasswordValidation,
  resendOtpValidation,
} from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  emailVerificationContent,
  forgotPasswordContent,
  sendEmail,
} from "../utils/email.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User Not Found", 400);
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error } = registerValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => {
        return err.message.replace(/["]/g, "");
      });
      throw new ApiError("Validation failed", 400, messages);
    }

    const { name, email, password, address, gender, dob, phone, role } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }
    const verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email,
      password,
      address,
      gender,
      dob,
      phone,
      role,
      verifyOtp,
      verifyOtpExpireAt: Date.now() + 60 * 1000,
    });

    await newUser.save();

    const mailgenContent = await emailVerificationContent(name, verifyOtp);

    await sendEmail({
      email: newUser.email,
      subject: "تأكيد البريد الإلكتروني",
      mailgenContent,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          "User registered successfully and verification email has been sent",
          null,
          201
        )
      );
  }
);

export const verifyEmail = AsyncHandler(async (req: Request, res: Response) => {
  const { verifyOtp } = req.body;

  const user = await User.findOne({
    verifyOtp,
    verifyOtpExpireAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError("Invalid or Expired varification code", 400);
  }

  user.isEmailVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = undefined;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse("Email verified successfully", null, 200));
});

export const login = AsyncHandler(async (req: Request, res: Response) => {
  const { error } = loginValidation.validate(req.body);

  if (error) {
    const messages = error.details.map((err) =>
      err.message.replace(/["]/g, "")
    );
    throw new ApiError("Validation failed", 400, messages);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError("Invalid credentials", 401);
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      "Email not verified. Please verify your email first.",
      403
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id.toString()
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    isEmailVerified: user.isEmailVerified,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        "User logged in successfully",
        {
          user: userResponse,
          accessToken,
          refreshToken,
        },
        200
      )
    );
});

export const forgotPassword = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error } = forgotPasswordValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => {
        return err.message.replace(/["]/g, "");
      });
      throw new ApiError("Validation failed", 400, messages);
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError("User Not Found", 400);
    }
    if (!user.isEmailVerified) {
      throw new ApiError(
        "Email not verified. Please verify your email first.",
        403
      );
    }
    const resetOtp = user.generateOtp("reset");
    await user.save({ validateBeforeSave: false });
    const mailgenContent = await forgotPasswordContent(user.name, resetOtp);

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      mailgenContent,
    });
    res
      .status(200)
      .json(
        new ApiResponse("OTP sent to your email", { email: user.email }, 200)
      );
  }
);

export const verifyResetOtp = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error } = verifyResetOtpValidation.validate(req.body);
    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, "")
      );
      throw new ApiError("Validation failed", 400, messages);
    }

    const { email, resetPasswordOtp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp,
      resetPasswordOtpExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError("Invalid or expired OTP", 400);
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          "OTP verified. You can now reset your password",
          { email: user.email },
          200
        )
      );
  }
);

export const resetPassword = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error } = resetPasswordValidation.validate(req.body);
    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, "")
      );
      throw new ApiError("Validation failed", 400, messages);
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError("User not found", 404);
    }
    user.password = password;
    user.resetPasswordOtp = "";
    user.resetPasswordOtpExpireAt = undefined;
    await user.save();

    res.status(200).json(new ApiResponse("Password reset successfully", 200));
  }
);

export const logout = AsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  await User.findByIdAndUpdate(
    userId,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse("User logged out", 200));
});

export const getCurrentUser = AsyncHandler(
  async (req: Request, res: Response) => {
    const _id = req.user?._id;
    console.log(_id)
    const user =await User.findById( _id ).select("-password -refreshToken");
    res
      .status(200)
      .json(new ApiResponse("User retrieved successfully", user , 200));
  }
);
