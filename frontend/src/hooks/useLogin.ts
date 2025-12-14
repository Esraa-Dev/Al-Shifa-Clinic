import { QueryClient, useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../utils/apiError";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient=new QueryClient()
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast.success(data?.message || "Login successful!");
      queryClient.invalidateQueries({
        queryKey:["currentUser"]
      })
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Login failed"));
    },
  });
};
