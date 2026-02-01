import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../../services/notificationService";

export const useNotifications = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationService.getNotifications(params),
  });
};
