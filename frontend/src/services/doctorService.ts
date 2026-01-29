import type { DoctorFilters } from "../types/types";
import api from "./axiosInstance";

export const doctorService = {
  getDoctors: async (filters: DoctorFilters) => {
    const response = await api.get("/doctors", {
      params: filters,
    });
    return response.data.data;
  },

  getTopDoctors: async (limit: number = 4) => {
    const response = await api.get("/doctors/top", {
      params: { limit },
    });
    return response.data.data;
  },

  getDoctorById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data.data;
  },
  updateDoctorProfile: async (data: any) => {
    const response = await api.put("/doctors/profile", data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/doctors/profile");
    return response.data;
  },
  getDoctorStats: async () => {
    const response = await api.get("/doctors/stats");
    return response.data.data;
  },
  getDoctorProfile: async () => {
    const response = await api.get("doctors/profile");
    return response.data.data;
  },
  updateDoctorProfileInfo: async (data: any) => {
    const response = await api.put("doctors/profile", data);
    return response.data;
  },
  useUpdateDoctorImage: async (formData: FormData) => {
    const response = await api.put("doctors/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
