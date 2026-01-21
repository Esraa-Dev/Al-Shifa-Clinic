import { toast } from "react-toastify";
import { appointmentService } from "../../services/appointmentService";
import { getApiErrorMessage } from "../../utils/apiError";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { BookAppointmentParams } from "../../types/types";

export const useBookAppointment = (onPaymentRequired: (data: any) => void) => {
  const navigate = useNavigate();

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
      const errorMessage = getApiErrorMessage(error, "Failed to book appointment");
      toast.error(errorMessage);
    },
  });
};