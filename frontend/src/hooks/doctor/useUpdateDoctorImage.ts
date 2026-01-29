import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { doctorService } from "../../services/doctorService";
import { getApiErrorMessage } from "../../utils/apiError";
import { useTranslation } from "react-i18next";

export const useUpdateDoctorImage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: doctorService.useUpdateDoctorImage,
    onSuccess: (data) => {
      toast.success(data?.message || "Profile image updated successfully");
      queryClient.invalidateQueries({ queryKey: ["doctorProfile"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("common:defaultError")));
    },
  });
};
