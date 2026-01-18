import api from "./axiosInstance.js";
export const contactService = {
  sendMessage: async (data: any) => {
    const response = await api.post("contact", data);
    return response.data;
  },
};
