import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointmentService";

export const useCheckPaymentIntentStatus = (paymentIntentId:string) => {
  return useQuery({
    queryKey: ["paymentIntentStatus", paymentIntentId],
    queryFn: () => appointmentService.checkPaymentIntentStatus(paymentIntentId),
    enabled: !!paymentIntentId,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });
};