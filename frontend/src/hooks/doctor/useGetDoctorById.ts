import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../../services/doctorService";

export const useGetDoctorById = (id: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorService.getDoctorById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
