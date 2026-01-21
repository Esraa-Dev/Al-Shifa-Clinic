import { useState } from "react";
import { FileText, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APPOINTMENT_TYPES } from "../../../constants/constants";
import { Button } from "../../../components/ui/Button";
import type { AppointmentInfoStepProps } from "../../../types/types";


export function AppointmentInfoStep({
    consultationType,
    setConsultationType,
    symptoms,
    setSymptoms,
    onNext,
    onBack,
}: AppointmentInfoStepProps) {
    const { t, i18n } = useTranslation("book");
    const [error, setError] = useState<string | null>(null);

    const handleNext = () => {
        if (!consultationType) {
            setError(t("book:bookAppointment.errorConsultationType"));
            return;
        }

        if (!symptoms || symptoms.trim().length < 10) {
            setError(t("book:bookAppointment.errorSymptoms"));
            return;
        }

        setError(null);
        onNext();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{t("book:bookAppointment.consultationDetails")}</h3>
                        <p className="text-gray-600">{t("book:bookAppointment.consultationDescription")}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">{t("book:bookAppointment.consultationType")}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {APPOINTMENT_TYPES.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => {
                                        setConsultationType(type.id as any);
                                        setError(null);
                                    }}
                                    className={`
                    p-6 rounded-xl border-2 flex flex-col items-center gap-4 transition-all cursor-pointer duration-200
                    ${consultationType === type.id
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }
                  `}
                                >
                                    <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${consultationType === type.id ? "bg-primary text-white" : "bg-gray-100 text-primaryText"}
                  `}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-800">{t(type.labelKey)}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">{t("book:bookAppointment.describeSymptoms")}</h4>
                    <p className="text-gray-600 mb-4">{t("book:bookAppointment.symptomsDescription")}</p>
                    <textarea
                        rows={4}
                        value={symptoms}
                        onChange={(e) => {
                            setSymptoms(e.target.value);
                            setError(null);
                        }}
                        placeholder={t("book:bookAppointment.symptomsPlaceholder")}
                        className="w-full p-4 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2">
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