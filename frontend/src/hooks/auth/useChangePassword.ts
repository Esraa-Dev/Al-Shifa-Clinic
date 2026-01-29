import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { useTranslation } from "react-i18next";

export const useChangePassword = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("common:defaultError")));
    },
  });
};
