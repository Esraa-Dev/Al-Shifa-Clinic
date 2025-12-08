import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../utils/apiError";

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Registration failed"));
    },
  });
};
