import api from "./axiosInstance";

export const authService = {
  login: async (data) => {
    const response = await api.post("auth/login", data);
    return response.data;
  },

  register: async (data) => {
    const response = await api.post("auth/register", data);
    return response.data;
  },
};
