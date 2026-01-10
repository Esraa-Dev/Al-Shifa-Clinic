import api from "./axiosInstance";

export const appointmentService = {
  bookAppointment: async ({
    doctorId,
    data,
  }: {
    doctorId: string;
    data: any;
  }) => {
    const response = await api.post(`/appointments/book/${doctorId}`, data);
    return response.data;
  },
  
  getBookedSlots: async (params: { doctorId: string; date: string }) => {
    const response = await api.get(
      `/appointments/booked-slots/${params.doctorId}/${params.date}`
    );
    return response.data.data;
  },
  
  getDoctorAppointments: async (filters?: { status?: string[] | string }) => {
    const response = await api.get("/appointments/doctor", {
      params: filters,
    });
    return response.data.data;
  },

  getPatientAppointments: async (filters?: { status?: string[] | string }) => {
    const response = await api.get("/appointments/patient", {
      params: filters,
    });
    return response.data.data;
  },

};