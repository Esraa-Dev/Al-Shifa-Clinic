import { useQuery } from "@tanstack/react-query";
import { ratingService } from "../services/ratingService";

interface UseDoctorRatingsParams {
  page?: number;
  limit?: number;
}

export const useDoctorRatings = (params?: UseDoctorRatingsParams) => {
  return useQuery({
    queryKey: ["doctorRatings", params],
    queryFn: () => ratingService.getDoctorRatings(params),
    staleTime: 5 * 60 * 1000,
  });
};