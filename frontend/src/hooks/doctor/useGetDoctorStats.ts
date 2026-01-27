import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../../services/doctorService";

export const useDoctorStats = () => {
  return useQuery({
    queryKey: ["dashboardDoctorStats"],
    queryFn: () => doctorService.getDoctorStats(),
  });
};
