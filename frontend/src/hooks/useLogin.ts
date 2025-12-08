import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../utils/apiError";

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast.success(data?.message || "Login successful!");
      console.log("User data:", data?.user);
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Login failed"));
    },
  });
};
