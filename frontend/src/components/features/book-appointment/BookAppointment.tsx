import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDoctorById } from "../../../hooks/doctor/useGetDoctorById";
import { BookHeader } from "./BookHeader";
import { useGetBookedSlots } from "../../../hooks/appointment/useGetBookedSlots";
import { useBookAppointment } from "../../../hooks/appointment/useBookAppointment";
import { calculateEndTime } from "../../../utils/calculateEndTime";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "./PaymentForm";
import { DoctorCard } from "./DoctorCard";
import { BookingSteps } from "./BookingSteps";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { AppointmentInfoStep } from "./AppointmentInfoStep";
import { ReviewStep } from "./ReviewStep";
import { DoctorCardSkeleton } from "./DoctorCardSkeleton";
import { useCheckPaymentStatus } from "../../../hooks/appointment/useCheckPaymentStatus";
import { CheckCircle } from "lucide-react";

registerLocale("ar", ar);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const BookAppointment = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedSlot, setSelectedSlot] = useState("");
    const [consultationType, setConsultationType] = useState<"clinic" | "video" | "voice">("clinic");
    const [symptoms, setSymptoms] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [appointmentId, setAppointmentId] = useState("");
    const [paymentCompleted] = useState(false);

    const { data: doctor, isLoading: isLoadingDoctor } = useGetDoctorById(id || "");
    const { data: bookedSlots = [], isLoading: isLoadingSlots } = useGetBookedSlots({
        doctorId: id || "",
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
    });

    const { refetch: checkPayment } = useCheckPaymentStatus(appointmentId);

    const { mutate, isPending: isBooking } = useBookAppointment((data) => {
        setClientSecret(data.clientSecret);
        setAppointmentId(data.appointmentId);
        setCurrentStep(4);
    });

    useEffect(() => {
        if (appointmentId && currentStep === 4) {
            checkPayment();
        }
    }, [appointmentId, currentStep, checkPayment]);

    const generateSlots = () => {
        let slots = [];
        for (let hour = 9; hour <= 23; hour++) {
            const currentHour = hour.toString().padStart(2, "0");
            slots.push(`${currentHour}:00`, `${currentHour}:30`);
        }
        return slots;
    };

    const handleBookAppointment = () => {
        if (!id || !doctor || !selectedDate) return;
        const payload = {
            appointmentDate: format(selectedDate, "yyyy-MM-dd"),
            startTime: selectedSlot,
            endTime: calculateEndTime(selectedSlot),
            type: consultationType,
            fee: doctor.fee || 0,
            symptoms: symptoms
        };
        mutate({ doctorId: id, data: payload });
    };

    if (paymentCompleted && currentStep === 4) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8 pb-20">
                <div className="container max-w-6xl mx-auto px-4">
                    <BookHeader />
                    <BookingSteps currentStep={5} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden p-8">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        {t("paymentSuccessful")}
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {t("appointmentConfirmed")}
                                    </p>
                                    <div className="animate-pulse">
                                        <p className="text-gray-500">
                                            {t("redirectingToAppointments")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            {doctor && <DoctorCard doctor={doctor} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="container max-w-6xl mx-auto px-4">
                <BookHeader />
                <BookingSteps currentStep={currentStep} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {isLoadingDoctor ? (
                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-8">
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                        </div>
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-8">
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        </div>
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ) : !doctor ? (
                            <div className="min-h-[400px] flex items-center justify-center">
                                <p className="text-xl font-bold text-gray-800">{t("bookAppointment.doctorNotFound")}</p>
                            </div>
                        ) : (
                            <>
                                {currentStep === 1 && (
                                    <PersonalInfoStep
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                        selectedSlot={selectedSlot}
                                        setSelectedSlot={setSelectedSlot}
                                        bookedSlots={bookedSlots}
                                        isLoadingSlots={isLoadingSlots}
                                        generateSlots={generateSlots}
                                        onNext={() => setCurrentStep(2)}
                                        onBack={() => navigate(-1)}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <AppointmentInfoStep
                                        consultationType={consultationType}
                                        setConsultationType={setConsultationType}
                                        symptoms={symptoms}
                                        setSymptoms={setSymptoms}
                                        onNext={() => setCurrentStep(3)}
                                        onBack={() => setCurrentStep(1)}
                                    />
                                )}
                                {currentStep === 3 && (
                                    <ReviewStep
                                        selectedDate={selectedDate}
                                        selectedSlot={selectedSlot}
                                        consultationType={consultationType}
                                        doctorFee={doctor?.fee || 0}
                                        symptoms={symptoms}
                                        isBooking={isBooking}
                                        onBack={() => setCurrentStep(2)}
                                        onConfirm={handleBookAppointment}
                                    />
                                )}
                                {currentStep === 4 && clientSecret && appointmentId && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-8">
                                        <Elements stripe={stripePromise} options={{
                                            clientSecret,
                                            appearance: {
                                                theme: 'stripe',
                                            }
                                        }}>
                                            <PaymentForm
                                                clientSecret={clientSecret}
                                                appointmentId={appointmentId}
                                            />
                                        </Elements>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        {isLoadingDoctor ? (
                            <DoctorCardSkeleton />
                        ) : doctor ? (
                            <DoctorCard doctor={doctor} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;