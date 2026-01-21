import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointmentService";

export const useGetBookedDates = (doctorId: string) => {
  return useQuery({
    queryKey: ["bookedDates", doctorId],
    queryFn: () => appointmentService.getBookedDates(doctorId),
    enabled: !!doctorId,
  });
};