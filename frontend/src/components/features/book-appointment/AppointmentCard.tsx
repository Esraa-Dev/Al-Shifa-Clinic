import { useState } from "react";
import { Calendar, Clock, Phone, User, Video, ChevronDown, ChevronUp } from "lucide-react";
import type { AppointmentCardProps } from "../../../types/types";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useUpdateAppointmentStatus } from "../../../hooks/appointment/useUpdateAppointmentStatus";
import { useStartConsultation } from "../../../hooks/appointment/useStartConsultation";
import { Button } from "../../ui/Button";


export const AppointmentCard = ({
  appointment,
  isOnline = false,
  variant,
  onActionComplete
}: AppointmentCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { t, i18n } = useTranslation();

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateAppointmentStatus();
  const { mutate: startConsultation, isPending: isStartingCall } = useStartConsultation();

  const onStartCall = (type: "video" | "voice") => {
    startConsultation({
      id: appointment._id,
      type: type
    }, {
      onSuccess: onActionComplete
    });
  };

  const handleStatusUpdate = (newStatus: string) => {
    updateStatus({
      appointmentId: appointment._id,
      status: newStatus
    }, {
      onSuccess: onActionComplete
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const user = variant === "doctor" ? appointment.patientId : appointment.doctorId;

  const isDoctor = variant === "patient";
  const doctor = isDoctor ? appointment.doctorId : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 overflow-hidden">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={variant === "doctor" ? t("appointment:patient") : t("appointment:doctor")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-primary" />
                )}
              </div>
              {variant === "doctor" && (
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full transition-colors duration-300 ${isOnline ? "bg-green-500" : "bg-gray-300"}`}></div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {variant === "patient" ? `${t("appointment:doctorPrefix")} ` : ""}{user?.firstName} {user?.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusStyles(appointment.status)}`}>
                  {t(`appointment:status.${appointment.status.toLowerCase().replace(" ", "")}`)}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  {appointment.type === "video" ? <Video size={12} /> : appointment.type === "voice" ? <Phone size={12} /> : <Calendar size={12} />}
                  {t(`appointment:type.${appointment.type}`)}
                </span>
              </div>
              {isDoctor && doctor && (
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">{t("appointment:specialization")}:</span>{" "}
                  {i18n.language === "ar"
                    ? (doctor as any).specialization_ar || (doctor as any).specialization_en || (doctor as any).specialization
                    : (doctor as any).specialization_en || (doctor as any).specialization
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1 text-sm border-t md:border-t-0 border-primaryBorder pt-3 md:pt-0">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {format(new Date(appointment.appointmentDate), "d MMMM yyyy", {
                  locale: i18n.language === "ar" ? ar : undefined
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 text-primary" />
              <span>{appointment.startTime} - {appointment.endTime}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500">{t("appointment:fees")}:</span>
            <span className="mr-1 font-bold text-primary">{appointment.fee} {t("appointment:currency")}</span>
          </div>

          <div className="flex items-center gap-2">
            {variant === "doctor" && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 text-gray-400 cursor-pointer hover:text-primary transition-colors"
                  title={t("appointment:details")}
                >
                  {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {(appointment.type === "video" || appointment.type === "voice") &&
                  appointment.status !== "Completed" &&
                  appointment.status !== "Cancelled" && (
                    <Button
                      disabled={isStartingCall}
                      onClick={() => onStartCall(appointment.type as "video" | "voice")}
                      className="gap-1"
                    >
                      {isStartingCall ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        appointment.type === "video" ? <Video size={18} /> : <Phone size={18} />
                      )}
                      <span className="font-bold text-sm">{t("appointment:startCallNow")}</span>
                    </Button>
                  )}

                {appointment.type === "clinic" && appointment.status === "Scheduled" && (
                  <Button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusUpdate("In Progress")}
                  >
                    {t("appointment:startExamination")}
                  </Button>
                )}

                {appointment.type === "clinic" && appointment.status === "In Progress" && (
                  <Button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusUpdate("Completed")}
                  >
                    {t("appointment:endAppointment")}
                  </Button>
                )}

                {appointment.status === "In Progress" && appointment.type !== "clinic" && (
                  <Button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusUpdate("Completed")}
                  >
                    {t("appointment:endAppointment")}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {showDetails && appointment.symptoms && (
          <div className="mt-4 p-4 bg-gray-50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {variant === "doctor" ? t("appointment:patientComplaint") : t("appointment:symptoms")}:
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {appointment.symptoms || t("appointment:noSymptomsDescription")}
            </p>
          </div>
        )}

        {variant === "patient" && appointment.symptoms && !showDetails && (
          <div className="mt-4 pt-4 border-t border-primaryBorder">
            <p className="text-gray-700">
              <span className="font-semibold">{t("appointment:symptoms")}: </span>
              {appointment.symptoms}
            </p>
          </div>
        )}

        {isDoctor && doctor && (
          <>
            {(doctor as any).description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-gray-700">
                  <span className="font-semibold">{t("appointment:description")}: </span>
                  {i18n.language === "ar"
                    ? (doctor as any).description_ar || (doctor as any).description_en || (doctor as any).description
                    : (doctor as any).description_en || (doctor as any).description
                  }
                </p>
              </div>
            )}

            {(doctor as any).qualification && (
              <div className="mt-2">
                <p className="text-gray-700">
                  <span className="font-semibold">{t("appointment:qualification")}: </span>
                  {i18n.language === "ar"
                    ? (doctor as any).qualification_ar || (doctor as any).qualification_en || (doctor as any).qualification
                    : (doctor as any).qualification_en || (doctor as any).qualification
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};