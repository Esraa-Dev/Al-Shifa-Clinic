import { useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar, Clock, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import { format, isToday } from "date-fns";
import type { PersonalInfoStepProps } from "../../../types/types";

export function PersonalInfoStep({
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    bookedSlots,
    isLoadingSlots,
    generateSlots,
    onNext,
    onBack,
}: PersonalInfoStepProps) {
    const { t, i18n } = useTranslation("book");
    const [error, setError] = useState<string | null>(null);

    const handleNext = () => {
        if (!selectedDate) {
            setError(t("book:errorDate"));
            return;
        }

        if (!selectedSlot) {
            setError(t("book:errorTime"));
            return;
        }

        setError(null);
        onNext();
    };

    const isSlotInPast = (slot: string) => {
        if (!selectedDate || !isToday(selectedDate)) return false;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const [slotHour, slotMinute] = slot.split(':').map(Number);

        if (slotHour < currentHour) return true;
        if (slotHour === currentHour && slotMinute <= currentMinute) return true;

        return false;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-primaryBorder overflow-hidden">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{t("book:chooseDate")}</h3>
                        <p className="text-gray-600 text-sm">{t("book:selectDateMessage")}</p>
                    </div>
                </div>

                <div className="mb-8 flex justify-center lg:justify-start">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => {
                            setSelectedDate(date);
                            setSelectedSlot("");
                            setError(null);
                        }}
                        minDate={new Date()}
                        locale={i18n.language === "ar" ? "ar" : "en"}
                        inline
                        calendarClassName="shadow-none border-0 rounded-xl"
                        placeholderText={t("book:chooseDate")}
                        openToDate={new Date()}
                        startDate={null}
                    />
                </div>

                {selectedDate ? (
                    <div className="mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{t("book:chooseTime")}</h3>
                                <p className="text-gray-600 text-sm">{t("book:selectTimeMessage")} {format(selectedDate, "dd/MM/yyyy")}</p>
                            </div>
                        </div>

                        {isLoadingSlots ? (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                                {generateSlots().map((slot) => {
                                    const isBooked = bookedSlots.includes(slot);
                                    const isSelected = selectedSlot === slot;
                                    const isPast = isSlotInPast(slot);
                                    const isDisabled = isBooked || isPast;

                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => {
                                                if (!isDisabled) {
                                                    setSelectedSlot(slot);
                                                    setError(null);
                                                }
                                            }}
                                            disabled={isDisabled}
                                            className={`h-14 rounded-xl cursor-pointer border hover:border-primary font-bold transition-all duration-200 text-sm
                                            ${isSelected
                                                    ? "bg-primary/10 text-primaryText border border-primary shadow-lg shadow-primary/20 scale-105"
                                                    : isDisabled
                                                        ? "bg-gray-50 text-gray-300 border-primaryBorder cursor-not-allowed"
                                                        : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"}
                                               `}
                                            title={isPast ? t("book:timeInPast") : ""}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-8 text-center py-12 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">{t("book:noDateSelected")}</p>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <div className="flex justify-between pt-8 border-t border-primaryBorder mt-8">
                    <Button onClick={onBack} className="gap-2">
                        <ArrowLeft size={18} className={i18n.language === "ar" ? "rotate-180" : ""} />
                        {t("book:common.back")}
                    </Button>

                    <Button
                        onClick={handleNext}
                        className="gap-2"
                    >
                        {t("book:common.next")}
                        <ArrowRight size={18} className={i18n.language === "ar" ? "rotate-180" : ""} />
                    </Button>
                </div>
            </div>
        </div>
    );
}