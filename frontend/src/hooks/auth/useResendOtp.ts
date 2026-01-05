import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { authService } from "../../services/authService";

export const useResendOtp = () => {
  return useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "حدث خطأ أثناء التحقق"));
    },
  });
};
