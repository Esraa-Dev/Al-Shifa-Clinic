import api from "./axiosInstance";

export const adminService = {
  getDashboardStats: async() =>{
    const response = await api.get("/admin/stats");
    return response.data.data;
  }
};