import api from "./axiosInstance.js";
export const departmentService = {
  getDepartments: async () => {
    const response = await api.get("departments");
    return response.data.data;
  },
};
