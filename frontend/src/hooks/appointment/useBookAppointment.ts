import { toast } from "react-toastify";
import { appointmentService } from "../../services/appointmentService";
import { getApiErrorMessage } from "../../utils/apiError";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { BookAppointmentParams } from "../../types/types";

export const useBookAppointment = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ doctorId, data }: BookAppointmentParams) => {
      if (!doctorId || doctorId.trim() === "") {
        throw new Error("Doctor ID is required");
      }

      if (!data || typeof data !== "object") {
        throw new Error("Invalid appointment data");
      }

      return appointmentService.bookAppointment({ doctorId, data });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Appointment booked successfully!");
      navigate("/patient/appointments");
    },
    onError: (error: any) => {
      const errorMessage =
        error.message ||
        getApiErrorMessage(error, "Failed to book appointment");
      toast.error(errorMessage);
    },
  });
};
