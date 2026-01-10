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
};
