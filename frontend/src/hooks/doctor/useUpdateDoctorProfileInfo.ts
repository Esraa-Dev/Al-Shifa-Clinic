import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { doctorService } from "../../services/doctorService";

export const useUpdateDoctorProfileInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => doctorService.updateDoctorProfileInfo(data),
    onSuccess: (data) => {
      toast.success(data?.message || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["doctorProfile"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};
