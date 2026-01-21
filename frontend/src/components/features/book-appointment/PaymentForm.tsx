import { PaymentElement } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";
import { usePayment } from "../../../hooks/appointment/usePayment";
import { Button } from "../../ui/Button";
import type { PaymentFormProps } from "../../../types/types";

export const PaymentForm = ({ clientSecret, appointmentId }: PaymentFormProps) => {
    const { t } = useTranslation();
    const { handlePayment, isLoading, errorMessage, stripe } = usePayment({
        clientSecret,
        appointmentId,
    });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handlePayment();
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{t("book:confirmPayment")}</h2>
                <p className="text-gray-600">{t("book:completePaymentToConfirm")}</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <PaymentElement options={{ layout: "tabs" }} />
                </div>
                {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                        {errorMessage}
                    </div>
                )}
                <Button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="gap-2 w-full"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white/30 border-t-white"></div>
                            <span>{t("book:processing")}</span>
                        </div>
                    ) : (
                        <>
                            <CreditCard size={20} />
                            {t("book:payNow")}
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};