import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { patientService } from "../../services/patientService";
import { useTranslation } from "react-i18next";

export const useUpdateProfile = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patientService.updateProfileInfo,
    onSuccess: (data) => {
      toast.success(data?.message || "Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["patientProfile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("common:defaultError")));
    },
  });
};
