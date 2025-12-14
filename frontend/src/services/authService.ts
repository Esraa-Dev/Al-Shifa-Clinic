import type { ForgotPasswordFormData } from "../validations/forgotPasswordSchema";
import type { LoginFormData } from "../validations/loginSchema";
import type { VerifyOtpFormData } from "../validations/otpSchema";
import type { RegisterFormData } from "../validations/registerSchema";
import type { ResetOtpFormData } from "../validations/resetOtpSchema";
import type { ResetPasswordFormData } from "../validations/resetPasswordSchema";
import api from "./axiosInstance";

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await api.post("auth/login", data);
    return response.data;
  },
  register: async (data: RegisterFormData) => {
    const response = await api.post("auth/register", data);
    return response.data;
  },
   verifyEmail: async (data: VerifyOtpFormData) => {
    const response = await api.post("auth/verify-email", data);
    return response.data;
  },
  forgotPassword: async (data: ForgotPasswordFormData) => {
    const response = await api.post("auth/forgot-password", data);
    return response.data;
  },
  verifyResetOtp: async (data: ResetOtpFormData & { email: string }) => {
    const response = await api.post("auth/verify-reset-otp", data);
    return response.data;
  },
  resetPassword: async (data: ResetPasswordFormData & { email: string }) => {
    const response = await api.post("auth/reset-password", data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("auth/profile");
    return response.data.data;
  },
};
