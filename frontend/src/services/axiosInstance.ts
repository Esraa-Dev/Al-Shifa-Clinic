import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const failedRequest = error.config;

    if (error.response?.status === 401 && !failedRequest._retry) {
      failedRequest._retry = true;

      try {
        await authApi.post(`${import.meta.env.VITE_API_URL}auth/refresh-token`);
        return api(failedRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { authApi };
