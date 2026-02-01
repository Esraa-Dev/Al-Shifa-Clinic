import api from "./axiosInstance";

export const ratingService = {
  createRating: async (appointmentId: string, data: { rating: number; review: string }) => {
    const response = await api.post(`/ratings/appointment/${appointmentId}`, data);
    return response.data;
  },

  getDoctorRatings: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/ratings/doctor", { params });
    return response.data.data;
  },

  getPatientRatings: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/ratings/patient", { params });
    return response.data;
  },

  deleteRating: async (ratingId: string) => {
    const response = await api.delete(`/ratings/${ratingId}`);
    return response.data;
  },
};