import api from "./axiosInstance";

export const prescriptionService = {
  createPrescription: async (appointmentId: string, data: any) => {
    const response = await api.post(`/prescriptions/appointment/${appointmentId}`, data);
    return response.data;
  },

  getPrescriptions: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/prescriptions", { params });
    return response.data;
  },

  getPrescriptionById: async (prescriptionId: string) => {
    const response = await api.get(`/prescriptions/${prescriptionId}`);
    return response.data;
  },

  getPrescriptionByAppointmentId: async (appointmentId: string) => {
    const response = await api.get(`/prescriptions/appointment/${appointmentId}`);
    return response.data;
  },

  updatePrescription: async (prescriptionId: string, data: any) => {
    const response = await api.put(`/prescriptions/${prescriptionId}`, data);
    return response.data;
  },

  deletePrescription: async (prescriptionId: string) => {
    const response = await api.delete(`/prescriptions/${prescriptionId}`);
    return response.data;
  },
};