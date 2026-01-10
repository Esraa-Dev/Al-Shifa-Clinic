import { useQuery } from "@tanstack/react-query";
import type { BookedSlotsParams } from "../../types/types";
import { appointmentService } from "../../services/appointmentService";

export const useGetBookedSlots = ({ doctorId, date }: BookedSlotsParams) => {
  return useQuery({
    queryKey: ["bookedSlots", doctorId, date],
    queryFn: () => appointmentService.getBookedSlots({ doctorId, date }),
    enabled: !!doctorId && !!date,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
