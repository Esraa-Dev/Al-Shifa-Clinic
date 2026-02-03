import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { prescriptionService } from "../../services/prescriptionService";

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      appointmentId: string;
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
    }) => {
      const { appointmentId, ...prescriptionData } = params;
      return prescriptionService.createPrescription(
        appointmentId,
        prescriptionData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create prescription");
    },
  });
};