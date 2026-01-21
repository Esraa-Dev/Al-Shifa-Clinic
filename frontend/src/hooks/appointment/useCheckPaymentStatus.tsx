import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointmentService";

export const useCheckPaymentStatus = (appointmentId:string) => {
  return useQuery({
    queryKey: ["paymentStatus", appointmentId],
    queryFn: () => appointmentService.checkPaymentStatus(appointmentId),
    enabled: !!appointmentId,
    refetchInterval: 5000, 
    refetchIntervalInBackground: true,
    retry: 3,
  });
};