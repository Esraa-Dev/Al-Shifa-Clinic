import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { prescriptionService } from "../../services/prescriptionService";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../utils/apiError";

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: (variables: {
      prescriptionId: string;
      data: {
        diagnosis: string;
        medicines: Array<{
          name: string;
          dosage: string;
          frequency: string;
          duration: string;
          instructions?: string;
        }>;
        notes?: string;
        followUpDate?: string;
      };
    }) => prescriptionService.updatePrescription(
      variables.prescriptionId,
      variables.data
    ),
    onSuccess: (data) => {
      toast.success(data?.message || t("prescription:prescriptionUpdated"));
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["prescription", data.data?._id] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("prescription:updateFailed")));
    },
  });
};