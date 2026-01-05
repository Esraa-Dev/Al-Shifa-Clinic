import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const navigate=useNavigate()
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/verify-email", { state: data.data.email })
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Registration failed"));
    },
  });
};
