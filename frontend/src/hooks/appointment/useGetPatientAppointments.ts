import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointmentService";
import type { AppointmentsParams } from "../../types/types";

export const useGetPatientAppointments = (params?: AppointmentsParams) => {
  return useQuery({
    queryKey: ["patientAppointments", params],
    queryFn: () => appointmentService.getPatientAppointments(params),
    staleTime: 5 * 60 * 1000,
  });
};
