import api from "./axiosInstance";

export const statsService = {
  getHomeStats: async () => {
    const response = await api.get('/stats/home');
    return response.data;
  }
};
