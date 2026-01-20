import { useQuery } from "@tanstack/react-query";
import { statsService } from "../../services/statsService";

export const useGetHomeStats = () => {
  return useQuery({
    queryKey: ["homeStats"],
    queryFn: statsService.getHomeStats,
    staleTime: 5 * 60 * 1000,
  });
};
