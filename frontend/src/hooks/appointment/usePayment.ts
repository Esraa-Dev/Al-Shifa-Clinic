import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import type { PaymentFormProps } from "../../types/types";

export const usePayment = ({ clientSecret, paymentIntentId }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation("appointment");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setErrorMessage(t("book:paymentSystemNotReady"));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || t("book:paymentError"));
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?paymentIntentId=${paymentIntentId}`,
        },
        redirect: "always",
      });

      if (error) {
        setErrorMessage(error.message || t("book:paymentError"));
      }
    } catch (err) {
      setErrorMessage(t("book:paymentError"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handlePayment,
    isLoading,
    errorMessage,
    stripe,
    elements,
  };
};