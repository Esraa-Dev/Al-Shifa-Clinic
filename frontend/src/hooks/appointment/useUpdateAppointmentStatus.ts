import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointmentService";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { useTranslation } from "react-i18next";

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: string;
    }) => appointmentService.updateAppointmentStatus(appointmentId, status),
    onSuccess: (data, variables) => {
      toast.success(data?.message || t("appointment:appointment.statusUpdated"));
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.appointmentId],
      });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("appointment:appointment.updateFailed")));
    },
  });
};