import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../../services/doctorService";

export const useGetTopDoctors = (limit: number = 4) => {
  return useQuery({
    queryKey: ["top-doctors", limit],
    queryFn: () => doctorService.getTopDoctors(limit),
    staleTime: 5 * 60 * 1000,
  });
};
