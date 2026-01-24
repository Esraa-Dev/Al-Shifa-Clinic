import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import { useTranslation } from "react-i18next";

export const useStartConsultation = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const navigate = useNavigate();
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

      navigate(`/video-call/${roomId}?type=${type}&role=doctor`);
      toast.success(t("call.starting"));
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || t("appointment:call.failed"),
      );
    },
  });
};
