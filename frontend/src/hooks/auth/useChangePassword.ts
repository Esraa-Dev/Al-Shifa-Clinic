// hooks/auth/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to change password");
    },
  });
};