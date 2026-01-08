import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast.success(data?.message || "Login successful!");

      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      const user = data.data?.user;

      if (!user) {
        navigate("/");
        return;
      }

      if (user.role === "doctor") {
        if (user.profileStatus === "incomplete") {
          navigate("/doctor/onboarding");
        } else {
          navigate("/doctor/dashboard");
        }
      } else if (user.role === "patient") {
        navigate("/");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "حدث خطأ ما"));
    },
  });
};
