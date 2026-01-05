import express from "express";
import {
  registerUser,
  login,
  verifyEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  logout,
  getCurrentUser,
  refreshAccessToken,
  resendOtp,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getCurrentUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/resend-otp", resendOtp)
export default router;
