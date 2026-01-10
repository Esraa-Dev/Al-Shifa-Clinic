import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../../services/doctorService";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["doctorProfile"],
    queryFn: doctorService.getProfile,
    staleTime: 5 * 60 * 1000,
  });
};
