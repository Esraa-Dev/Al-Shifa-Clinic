import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointmentService";
import type { AppointmentsParams } from "../../types/types";

export const useGetDoctorAppointments = (params?: AppointmentsParams) => {
  return useQuery({
    queryKey: ["doctorAppointments", params],
    queryFn: () => appointmentService.getDoctorAppointments(params),
    staleTime: 5 * 60 * 1000, 
  });
};