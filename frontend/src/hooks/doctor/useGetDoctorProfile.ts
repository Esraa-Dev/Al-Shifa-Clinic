import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../../services/doctorService";

export const useDoctorProfile = () => {
  return useQuery({
    queryKey: ["doctorProfile"],
    queryFn: doctorService.getDoctorProfile,
  });
};
