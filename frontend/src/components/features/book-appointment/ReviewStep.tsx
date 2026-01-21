import { CheckCircle, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import { format } from "date-fns";
import type { ReviewStepProps } from "../../../types/types";


export const ReviewStep = ({
    selectedDate,
    selectedSlot,
    consultationType,
    doctorFee,
    symptoms,
    isBooking,
    onBack,
    onConfirm,
}: ReviewStepProps) => {
    const { t } = useTranslation("appointment");

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-primaryBorder overflow-hidden">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{t("book:bookAppointment.reviewBooking")}</h3>
                        <p className="text-gray-600">{t("book:bookAppointment.reviewDescription")}</p>
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-gray-500 text-sm mb-1">{t("book:bookAppointment.date")}</div>
                            <div className="text-lg font-bold text-gray-800">
                                {selectedDate && format(selectedDate, "dd/MM/yyyy")}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-gray-500 text-sm mb-1">{t("book:bookAppointment.time")}</div>
                            <div className="text-lg font-bold text-primary">{selectedSlot}</div>
                        </div>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-gray-600 text-sm mb-1">{t("book:bookAppointment.consultationTypeLabel")}</div>
                                <div className="font-bold text-gray-800">
                                    {t(`book:appointmentTypes.${consultationType}`)}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-gray-600 text-sm mb-1">{t("book:bookAppointment.fees")}</div>
                                <div className="text-2xl font-bold text-primary">{doctorFee} EGP</div>
                            </div>
                        </div>
                    </div>

                    {symptoms && (
                        <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/20">
                            <div className="text-gray-600 font-medium mb-2">{t("book:bookAppointment.symptomsMentioned")}</div>
                            <div className="text-gray-700 text-sm">"{symptoms}"</div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-8 border-t border-primaryBorder">
                    <Button onClick={onBack} className="px-6">
                        {t("common:back")}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isBooking}
                        className="bg-primary hover:bg-primary/90 text-white px-8"
                    >
                        {isBooking ? (
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                {t("common:loading")}
                            </div>
                        ) : consultationType !== "clinic" ? (
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                {t("book:proceedToPayment")}
                            </div>
                        ) : (
                            t("book:bookAppointment.confirmBooking")
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};