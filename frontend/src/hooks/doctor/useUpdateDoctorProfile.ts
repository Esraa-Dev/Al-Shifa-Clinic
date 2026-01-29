import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { doctorService } from "../../services/doctorService";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const useUpdateDoctorProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: any) => doctorService.updateDoctorProfile(data),
    onSuccess: (data) => {
      toast.success(data?.message || t("onboarding.profileUpdated"));
      navigate("/doctor/dashboard", { replace: true });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("common:defaultError")));
    },
  });
};
