import { toast } from "react-toastify";
import { appointmentService } from "../../services/appointmentService";
import { getApiErrorMessage } from "../../utils/apiError";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { BookAppointmentParams } from "../../types/types";
import { useTranslation } from "react-i18next";

export const useBookAppointment = (onPaymentRequired: (data: any) => void) => {
  const navigate = useNavigate();
    const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ doctorId, data }: BookAppointmentParams) => {
      return appointmentService.bookAppointment({ doctorId, data });
    },
    onSuccess: (response) => {
      if (response.data?.requiresPayment) {
        onPaymentRequired(response.data);
      } else {
        toast.success(response?.message || "Appointment booked successfully!");
        navigate("/patient/appointments");
      }
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("common:defaultError")));
    },
  });
};
