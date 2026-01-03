import { authApi } from "./api";
import api from "./axiosInstance";

export const authService = {
  login: async (data: any) => {
    const response = await authApi.post("auth/login", data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await authApi.post("auth/register", data);
    return response.data;
  },
  verifyEmail: async (data: any) => {
    const response = await authApi.post("auth/verify-email", data);
    return response.data;
  },
  forgotPassword: async (data: any) => {
    const response = await authApi.post("auth/forgot-password", data);
    return response.data;
  },
  verifyResetOtp: async (data: any) => {
    const response = await authApi.post("auth/verify-reset-otp", data);
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await authApi.post("auth/reset-password", data);
    return response.data;
  },
  logout: async () => {
    const response = await authApi.post("auth/logout");
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("auth/profile");
    return response.data.data;
  },
};
