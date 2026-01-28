import { Request, Response } from "express";
import User, {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  verifyResetOtpValidation,
  resetPasswordValidation,
  resendOtpValidation,
  changePasswordValidation,
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
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { COOKIE_OPTIONS, LOGOUT_COOKIE_OPTIONS } from "../constants.js";

export interface DecodedUser extends JwtPayload {
  _id: string;
  role: string;
}

const generateAccessAndRefreshToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const registerUser = AsyncHandler(
  async (req: Request, res: Response) => {
    const { value, error } = registerValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, "")
      );
      throw new ApiError(req.t("common:validationFailed"), 400, messages);
    }

    const { firstName, lastName, email, password, phone, role } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(req.t("user:userExists"), 400);
    }

    const verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      verifyOtp,
      verifyOtpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
      profileStatus: "incomplete",
    });

    await newUser.save();

    const mailgenContent = await emailVerificationContent(
      firstName,
      verifyOtp,
      req.language || "en"
    );

    await sendEmail({
      email: newUser.email,
      subject:
        req.language === "ar"
          ? "تأكيد البريد الإلكتروني"
          : "Email Verification",
      mailgenContent,
    });

    res
      .status(201)
      .json(new ApiResponse(req.t("user:userRegistered"), newUser, 201));
  }
);

export const verifyEmail = AsyncHandler(async (req: Request, res: Response) => {
  const { verifyOtp } = req.body;

  const user = await User.findOne({
    verifyOtp,
    verifyOtpExpireAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(req.t("user:otpInvalidOrExpired"), 400);
  }

  user.isEmailVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(req.t("user:emailVerified"), null, 200));
});

export const login = AsyncHandler(async (req: Request, res: Response) => {
  const { error } = loginValidation.validate(req.body);

  if (error) {
    const messages = error.details.map((err) =>
      err.message.replace(/["]/g, "")
    );
    throw new ApiError(req.t("common:validationFailed"), 400, messages);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(req.t("user:invalidCredentials"), 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(req.t("user:invalidCredentials"), 401);
  }

  if (!user.isEmailVerified) {
    throw new ApiError(req.t("user:emailNotVerified"), 403);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id.toString()
  );

  const userResponse = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    image: user.image,
    isEmailVerified: user.isEmailVerified,
    profileStatus: user.profileStatus,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        req.t("user:loginSuccess"),
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
      throw new ApiError(req.t("common:validationFailed"), 400, messages);
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(req.t("user:userNotFound"), 400);
    }
    if (!user.isEmailVerified) {
      throw new ApiError(req.t("user:emailNotVerified"), 403);
    }
    const resetOtp = user.generateOtp("reset");
    await user.save({ validateBeforeSave: false });
    const mailgenContent = await forgotPasswordContent(
      user.firstName,
      resetOtp,
      req.language || "en"
    );

    await sendEmail({
      email: user.email,
      subject:
        req.language === "ar"
          ? "رمز إعادة تعيين كلمة المرور"
          : "Password Reset OTP",
      mailgenContent,
    });
    res
      .status(200)
      .json(new ApiResponse(req.t("user:otpSent"), { email: user.email }, 200));
  }
);

export const verifyResetOtp = AsyncHandler(
  async (req: Request, res: Response) => {
    const { error } = verifyResetOtpValidation.validate(req.body);
    if (error) {
      const messages = error.details.map((err) =>
        err.message.replace(/["]/g, "")
      );
      throw new ApiError(req.t("common:validationFailed"), 400, messages);
    }

    const { email, resetPasswordOtp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp,
      resetPasswordOtpExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(req.t("user:otpInvalidOrExpired"), 400);
    }

    res
      .status(200)
      .json(
        new ApiResponse(req.t("user:otpVerified"), { email: user.email }, 200)
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
      throw new ApiError(req.t("common:validationFailed"), 400, messages);
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(req.t("user:userNotFound"), 404);
    }
    user.password = password;
    user.resetPasswordOtp = "";
    user.resetPasswordOtpExpireAt = undefined;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(req.t("user:passwordResetSuccess"), 200));
  }
);

export const logout = AsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );
  }

  res
    .status(200)
    .clearCookie("accessToken", LOGOUT_COOKIE_OPTIONS)
    .clearCookie("refreshToken", LOGOUT_COOKIE_OPTIONS)
    .json(new ApiResponse(req.t("user:logoutSuccess"), 200));
});

export const getCurrentUser = AsyncHandler(
  async (req: Request, res: Response) => {
    const _id = req.user?._id;

    if (!_id) {
      throw new ApiError(req.t("common:unauthorized"), 401);
    }

    const user = await User.findById(_id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(req.t("user:userNotFound"), 404);
    }

    res
      .status(200)
      .json(new ApiResponse(req.t("user:userRetrieved"), user, 200));
  }
);

export const refreshAccessToken = AsyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(req.t("user:invalidToken"), 401);
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is missing");
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as DecodedUser;

    const user = await User.findById(decoded._id);
    if (!user || !user.refreshToken) {
      throw new ApiError(req.t("user:userNotFound"), 401);
    }
    if (user.refreshToken !== refreshToken) {
      throw new ApiError(req.t("user:invalidToken"), 401);
    }
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .cookie("accessToken", newAccessToken, COOKIE_OPTIONS)
      .cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
      .json(
        new ApiResponse(
          req.t("user:tokenRefreshed"),
          { accessToken: newAccessToken },
          200
        )
      );
  }
);

export const resendOtp = AsyncHandler(async (req: Request, res: Response) => {
  const { value, error } = resendOtpValidation.validate(req.body);
  if (error) {
    const messages = error.details.map((err) =>
      err.message.replace(/["]/g, "")
    );
    throw new ApiError(req.t("common:validationFailed"), 400, messages);
  }
  const { email, type } = value;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(req.t("user:userNotFound"), 404);
  }

  let otp;
  let mailgenContent;

  if (type === "verification") {
    if (user.isEmailVerified) {
      throw new ApiError(req.t("user:emailAlreadyVerified"), 400);
    }
    otp = user.generateOtp("verification");
    mailgenContent = await emailVerificationContent(
      user.firstName,
      otp,
      req.language || "en"
    );
  } else if (type === "reset") {
    if (!user.isEmailVerified) {
      throw new ApiError(req.t("user:emailNotVerified"), 403);
    }
    otp = user.generateOtp("reset");
    mailgenContent = await forgotPasswordContent(
      user.firstName,
      otp,
      req.language || "en"
    );
  } else {
    throw new ApiError(req.t("user:invalidOtpType"), 400);
  }

  await user.save({ validateBeforeSave: false });

  if (!mailgenContent || !mailgenContent.body) {
    throw new ApiError(req.t("common:serverError"), 500);
  }

  await sendEmail({
    email: user.email,
    subject:
      type === "verification"
        ? req.language === "ar"
          ? "رمز تحقق البريد الإلكتروني"
          : "Email Verification OTP"
        : req.language === "ar"
        ? "رمز إعادة تعيين كلمة المرور"
        : "Password Reset OTP",
    mailgenContent,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        req.t("user:otpResentSuccess"),
        { email: user.email },
        200
      )
    );
});


export const changePassword = AsyncHandler(async (req: Request, res: Response) => {
  const { error } = changePasswordValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((err) =>
      err.message.replace(/["]/g, "")
    );
    throw new ApiError("Validation failed", 400, messages);
  }

  const { currentPassword, newPassword } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError("Unauthorized", 401);
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError("Invalid current password", 400);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  
  if (isSamePassword) {
    throw new ApiError("New password cannot be the same as current password", 400);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse("Password changed successfully", null, 200));
});