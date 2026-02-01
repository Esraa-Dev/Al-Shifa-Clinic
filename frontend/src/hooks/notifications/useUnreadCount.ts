import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../../services/notificationService";

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000,
  });
};



