import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDoctorById } from "../hooks/doctor/useGetDoctorById";
import BookHeader from "../components/features/BookHeader";
import BookingSteps from "../components/features/BookingSteps";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { APPOINTMENT_TYPES } from "../constants/constants";
import { useGetBookedSlots } from "../hooks/appointment/useGetBookedSlots";
import { useBookAppointment } from "../hooks/appointment/useBookAppointment";
import { calculateEndTime } from "../utils/calculateEndTime";

const BookAppointment = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [consultationType, setConsultationType] = useState<"clinic" | "video" | "voice">("clinic");
    const [symptoms, setSymptoms] = useState("");

    const { data: doctor, isLoading: isLoadingDoctor } = useGetDoctorById(id || "");
    const { data: bookedSlots = [] } = useGetBookedSlots({
        doctorId: id || "",
        date: selectedDate
    });
    const { mutate, isPending: isBooking } = useBookAppointment();

    const generateSlots = () => {
        let slots = [];
        for (let hour = 9; hour <= 23; hour++) {
            const currentHour = hour.toString().padStart(2, "0");
            slots.push(`${currentHour}:00`, `${currentHour}:30`);
        }
        return slots;
    };

    const availableSlots = generateSlots().filter(
        (slot) => !bookedSlots.includes(slot)
    );

    const handleBookAppointment = () => {
        if (!id || !doctor) {
            console.error("Doctor ID or doctor data is missing");
            return;
        }

        const payload = {
            appointmentDate: selectedDate,
            startTime: selectedSlot,
            endTime: calculateEndTime(selectedSlot),
            type: consultationType,
            fee: doctor.fee || 0,
            symptoms: symptoms
        };

        mutate({ doctorId: id, data: payload });
    };

    if (isLoadingDoctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل بيانات الطبيب...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">الطبيب غير موجود</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-8">
            <div className="container">
                <BookHeader doctor={doctor} />
                <BookingSteps currentStep={currentStep} />

                {currentStep === 1 && (
                    <div className="p-6 rounded-xl shadow-sm border border-gray-100">
                        <label
                            htmlFor="appointment-date"
                            className="block font-medium text-primaryText mb-4"
                        >
                            اختر تاريخ الحجز:
                        </label>
                        <input
                            id="appointment-date"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full p-3 mb-8 rounded-md placeholder:primaryText focus:outline-none bg-white transition duration-200"
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <label className="block font-medium text-primaryText mb-4">
                            اختر الوقت
                        </label>

                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-3 rounded-lg border border-primaryBorder text-sm transition-all cursor-pointer ${selectedSlot === slot
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : "bg-white text-primaryText hover:border-primary"
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between pt-4">
                            <Button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft size={20} />
                                رجوع
                            </Button>
                            <Button
                                onClick={() => setCurrentStep(2)}
                                disabled={!selectedDate || !selectedSlot}
                                className="bg-primary hover:bg-primary/65"
                            >
                                التالي
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <h3 className="text-xl font-bold text-primaryText text-right">
                            تفاصيل الاستشارة
                        </h3>

                        <div className="space-y-4">
                            <label className="block font-medium text-gray-700">
                                نوع الاستشارة:
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {APPOINTMENT_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setConsultationType(type.id as "clinic" | "video" | "voice")}
                                            className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-2 transition-all ${consultationType === type.id
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-primaryBorder bg-white text-gray-500"
                                                }`}
                                        >
                                            <Icon size={24} />
                                            <span className="font-bold">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label
                                htmlFor="symptoms"
                                className="block font-medium text-gray-700"
                            >
                                وصف الأعراض
                            </label>
                            <textarea
                                id="symptoms"
                                rows={4}
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="اشرح ما تشعر به لمساعدة الطبيب..."
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all"
                            />
                        </div>

                        <div className="flex justify-between pt-6 border-t border-gray-100">
                            <Button
                                onClick={() => setCurrentStep(1)}
                                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                رجوع
                            </Button>
                            <Button
                                onClick={() => setCurrentStep(3)}
                                className="bg-primary hover:bg-primary/80"
                            >
                                التالي
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-left duration-500">
                        <h3 className="text-xl font-bold text-primaryText text-center mb-6">مراجعة بيانات الحجز</h3>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
                            <div className="flex justify-between items-center border-b border-primaryBorder pb-3">
                                <span className="text-gray-500">التاريخ</span>
                                <span className="font-semibold">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-primaryBorder pb-3">
                                <span className="text-gray-500">الوقت</span>
                                <span className="font-semibold text-primary">{selectedSlot}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-primaryBorder pb-3">
                                <span className="text-gray-500">نوع الاستشارة</span>
                                <span className="font-semibold">
                                    {APPOINTMENT_TYPES.find(t => t.id === consultationType)?.label || consultationType}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-primaryBorder pb-3">
                                <span className="text-gray-500">الرسوم</span>
                                <span className="font-semibold text-primary">{doctor.fee || 0} ريال</span>
                            </div>
                            {symptoms && (
                                <div className="space-y-1">
                                    <span className="text-gray-500 text-sm">الأعراض المذكورة:</span>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic text-sm">"{symptoms}"</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between pt-6">
                            <Button
                                onClick={() => setCurrentStep(2)}
                            >
                                رجوع للتعديل
                            </Button>
                            <Button
                                onClick={handleBookAppointment}
                                disabled={isBooking}
                                className="bg-primary hover:bg-primary/50 text-white px-10"
                            >
                                {isBooking ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        جاري الحجز...
                                    </div>
                                ) : (
                                    "تأكيد الحجز النهائي"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;