import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { prescriptionService } from "../../services/prescriptionService";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../utils/apiError";

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (prescriptionId: string) =>
      prescriptionService.deletePrescription(prescriptionId),
    onSuccess: (data, prescriptionId) => {
      toast.success(data?.message || t("prescription:prescriptionDeleted"));
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["prescription", prescriptionId],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("prescription:deleteFailed")));
    },
  });
};