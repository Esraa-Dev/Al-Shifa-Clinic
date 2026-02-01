import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ratingService } from "../../services/ratingService";
import { getApiErrorMessage } from "../../utils/apiError";
import { useTranslation } from "react-i18next";

export const useCreateRating = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (variables: {
      appointmentId: string;
      rating: number;
      review: string;
    }) =>
      ratingService.createRating(variables.appointmentId, {
        rating: variables.rating,
        review: variables.review,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, t("common:defaultError")));
    },
  });
};
