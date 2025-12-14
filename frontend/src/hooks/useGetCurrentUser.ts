import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
};
