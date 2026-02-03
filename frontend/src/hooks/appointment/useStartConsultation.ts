import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../../services/appointmentService";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import { useTranslation } from "react-i18next";

export const useStartConsultation = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (variables: { id: string; type: string }) =>
      appointmentService.startConsultation(variables),

    onSuccess: (response) => {
      const { roomId, type, patientId, doctorId } = response.data;

      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });

      if (socket) {
        socket.emit("start-call", {
          patientId: patientId?._id || patientId,
          roomId: roomId,
          type: type,
          doctorName: `${t("appointment:doctorPrefix")} ${doctorId?.lastName || ""}`,
        });
      }

      window.open(`/video-call/${roomId}?type=${type}&role=doctor`, "_blank");
      toast.success(t("appointment:call.starting"));
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("appointment:call.failed"),
      );
    },
  });
};
