import { useQuery } from "@tanstack/react-query";
import { prescriptionService } from "../../services/prescriptionService";

export const usePrescriptions = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["prescriptions", params],
    queryFn: () => prescriptionService.getPrescriptions(params),
    staleTime: 5 * 60 * 1000,
  });
};
