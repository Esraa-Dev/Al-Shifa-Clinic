import { useQuery } from "@tanstack/react-query";
import { prescriptionService } from "../../services/prescriptionService";

export const usePrescriptionByAppointmentId = (appointmentId?: string) => {
  return useQuery({
    queryKey: ["prescription", "appointment", appointmentId],
    queryFn: () => {
      if (!appointmentId) throw new Error("Appointment ID is required");
      return prescriptionService.getPrescriptionByAppointmentId(appointmentId);
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000,
  });
};
