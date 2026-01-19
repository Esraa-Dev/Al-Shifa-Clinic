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
      `/appointments/booked-slots/${params.doctorId}/slots/${params.date}`,
    );
    return response.data.data;
  },

  getDoctorAppointments: async (filters?: { status?: string[] | string }) => {
    const params: any = {};
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        params.status = filters.status.join(",");
      } else {
        params.status = filters.status;
      }
    }

    const response = await api.get("/appointments/doctor", { params });
    return response.data.data;
  },

  getPatientAppointments: async (filters?: { status?: string[] | string }) => {
    const params: any = {};
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        params.status = filters.status.join(",");
      } else {
        params.status = filters.status;
      }
    }
    const response = await api.get("/appointments/patient", { params });
    return response.data.data;
  },
  startConsultation: async ({ id, type }: { id: string; type: string }) => {
    const response = await api.post(`/appointments/${id}/start-call`, { type });
    return response.data;
  },
  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    const response = await api.patch(`/appointments/${appointmentId}/status`, {
      status,
    });
    return response.data;
  },
};
