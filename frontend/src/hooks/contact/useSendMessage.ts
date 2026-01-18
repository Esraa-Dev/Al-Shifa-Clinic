import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/apiError";
import { useTranslation } from "react-i18next";
import { contactService } from "../../services/contactService";

export const useSendMessage = () => {
  const { t } = useTranslation("contact");

  return useMutation({
    mutationFn: contactService.sendMessage,
    onSuccess: (data) => {
      toast.success(data?.message || t("successMessage"));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("defaultError")));
    },
  });
};
