import api from "./axiosInstance.js";
export const departmentService = {
  getDepartments: async (page = 1, limit = 10, search = "") => {
    const response = await api.get("departments", {
      params: { page, limit, search },
    });
    return response.data.data;
  },
};
