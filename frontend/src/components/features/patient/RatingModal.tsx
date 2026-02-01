import { useState } from "react";
import { Star, X } from "lucide-react";
import { Textarea } from "../../ui/Textarea";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useCreateRating } from "../../../hooks/rating/useCreateRating";
import type { RatingFormData, RatingModalProps } from "../../../types/types";


export const RatingModal = ({ appointmentId, isOpen, onClose }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { mutate, isPending } = useCreateRating();
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm<RatingFormData>();

  const onSubmit = (data: RatingFormData) => {
    if (rating === 0) return;

    mutate(
      { appointmentId, rating, review: data.review },
      {
        onSuccess: () => {
          setRating(0);
          reset();
          onClose();
        },
        onError: () => {
          onClose();
        }
      }
    );

  }
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl font-bold text-primaryText"
              >
                {t("rating:rateAppointment")}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label={t("common:close")}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  {t("rating:howWasExperience")}
                </p>
                <div className="flex gap-2" role="radiogroup">
                  <span id="star-rating-label" className="sr-only">
                    {t("rating:selectRating")}
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl  rounded-full p-1"
                      title={`${star} ${star === 1 ? t("rating:star") : t("rating:stars")}`}
                    >
                      <Star
                        className={`${star <= (hoverRating || rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                          } transition-colors`}
                        size={32}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                label={t("rating:reviewLabel")}
                placeholder={t("rating:reviewPlaceholder")}
                rows={3}
                register={register("review")}
              />

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isPending}
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={rating === 0 || isPending}
                >
                  {isPending ? t("common:submitting") : t("common:submit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };