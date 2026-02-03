import { useState } from "react";
import { Calendar, Clock, Phone, User, Video, ChevronDown, ChevronUp, FileText, Eye, Star, Home, VideoIcon, Mic } from "lucide-react";
import type { AppointmentCardProps } from "../../../types/types";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useUpdateAppointmentStatus } from "../../../hooks/appointment/useUpdateAppointmentStatus";
import { useStartConsultation } from "../../../hooks/appointment/useStartConsultation";
import { Button } from "../../ui/Button";
import { PrescriptionModal } from "../doctor/PrescriptionModal";
import { RatingModal } from "../patient/RatingModal";
import { usePrescriptionByAppointmentId } from "../../../hooks/prescription/usePrescriptionByAppointmentId";
import PatientPrescriptionModal from "../patient/PatientPrescriptionModal";

export const AppointmentCard = ({
  appointment,
  isOnline = false,
  variant,
  onActionComplete
}: AppointmentCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showPatientPrescriptionModal, setShowPatientPrescriptionModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { t, i18n } = useTranslation();

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateAppointmentStatus();
  const { mutate: startConsultation, isPending: isStartingCall } = useStartConsultation();

  const { data: prescriptionData } = usePrescriptionByAppointmentId(
    appointment.hasPrescription ? appointment._id : undefined
  );

  const getEntityData = (data: any) => {
    if (!data || typeof data === "string") return { name: "N/A", image: "", info: null };
    return {
      name: `${data.firstName} ${data.lastName}`,
      image: data.image,
      info: data
    };
  };

  const displayData = variant === "patient"
    ? getEntityData(appointment.doctorId)
    : getEntityData(appointment.patientId);

  const onStartCall = (type: "video" | "voice") => {
    startConsultation({ id: appointment._id, type }, { onSuccess: onActionComplete });
  };

  const handleStatusUpdate = (newStatus: string) => {
    updateStatus({ appointmentId: appointment._id, status: newStatus }, { onSuccess: onActionComplete });
  };

  const getStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      Pending: "bg-gray-100 text-gray-800 border-gray-200",
      Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Completed: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status] || styles.Pending;
  };

  const getTypeIcon = () => {
    switch(appointment.type) {
      case "clinic": return <Home className="w-4 h-4" />;
      case "video": return <VideoIcon className="w-4 h-4" />;
      case "voice": return <Mic className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  const getTypeStyles = () => {
    switch(appointment.type) {
      case "clinic": return "bg-purple-50 text-purple-600 border-purple-200";
      case "video": return "bg-blue-50 text-blue-600 border-blue-200";
      case "voice": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    
    if (appointmentDate.getTime() === today.getTime()) {
      return t("appointment:today");
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (appointmentDate.getTime() === yesterday.getTime()) {
      return t("appointment:yesterday");
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (appointmentDate.getTime() === tomorrow.getTime()) {
      return t("appointment:tomorrow");
    }
    
    return format(date, "d MMMM yyyy", { locale: i18n.language === "ar" ? ar : undefined });
  };

  const getDateStatus = (dateString: string) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    
    appointmentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) return "past";
    if (appointmentDate > today) return "future";
    return "today";
  };

  const dateStatus = getDateStatus(appointment.appointmentDate);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 overflow-hidden">
                  {displayData.image ? (
                    <img src={displayData.image} alt={displayData.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full transition-colors duration-300 ${isOnline ? "bg-green-500" : "bg-gray-300"}`}></span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {variant === "patient" ? `${t("appointment:doctorPrefix")} ` : ""}{displayData.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusStyles(appointment.status)}`}>
                    {t(`appointment:status.${appointment.status.toLowerCase().replace(" ", "")}`)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTypeStyles()}`}>
                    <span className="flex items-center gap-1">
                      {getTypeIcon()}
                      {t(`appointment:type.${appointment.type}`)}
                    </span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${appointment.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : appointment.paymentStatus === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                    {t(`appointment:payment.${appointment.paymentStatus}`)}
                  </span>
                  {appointment.hasPrescription && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-blue-50 text-blue-600">
                      {t("appointment:hasPrescription")}
                    </span>
                  )}
                  {appointment.isRated && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-yellow-50 text-yellow-600">
                      {t("appointment:rated")}
                    </span>
                  )}
                </div>
                {variant === "patient" && displayData.info?.specialization && (
                  <p className="text-xs text-gray-500 mt-1">
                    {i18n.language === "ar" ? displayData.info.specialization_ar : displayData.info.specialization_en}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1 text-sm border-t md:border-t-0 border-gray-50 pt-3 md:pt-0">
              <div className={`flex items-center gap-2 font-semibold ${dateStatus === "today" ? "text-blue-600" : dateStatus === "past" ? "text-gray-500" : "text-gray-700"}`}>
                <Calendar className={`w-4 h-4 ${dateStatus === "today" ? "text-blue-600" : "text-primary"}`} />
                <span>{formatDateForDisplay(appointment.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4 text-primary" />
                <span>{appointment.startTime} - {appointment.endTime}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t("appointment:fees")}</span>
                <span className="font-bold text-primary">{appointment.fee} {t("appointment:currency")}</span>
              </div>
              {appointment.type === "clinic" && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t("appointment:location")}</span>
                  <span className="font-medium text-gray-700">{t("appointment:clinicLocation")}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-lg"
              >
                {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {variant === "doctor" ? (
                <>
                  {appointment.paymentStatus === "paid" && ["video", "voice"].includes(appointment.type) && !["Completed", "Cancelled"].includes(appointment.status) && (
                    <Button disabled={isStartingCall} onClick={() => onStartCall(appointment.type as any)} className="gap-2 h-9 px-4">
                      {isStartingCall ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (appointment.type === "video" ? <Video size={16} /> : <Phone size={16} />)}
                      {t("appointment:startCallNow")}
                    </Button>
                  )}

                  {appointment.paymentStatus === "paid" && appointment.type === "clinic" && appointment.status === "Scheduled" && (
                    <Button disabled={isUpdatingStatus} onClick={() => handleStatusUpdate("In Progress")}>
                      {t("appointment:startExamination")}
                    </Button>
                  )}

                  {appointment.paymentStatus === "paid" && appointment.status === "In Progress" && (
                    <Button disabled={isUpdatingStatus} onClick={() => handleStatusUpdate("Completed")}>
                      {t("appointment:endAppointment")}
                    </Button>
                  )}

                  {appointment.status === "Completed" && !appointment.hasPrescription && (
                    <Button
                      onClick={() => setShowPrescriptionModal(true)}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText size={16} />
                      {t("appointment:addPrescription")}
                    </Button>
                  )}

                  {appointment.status === "Completed" && appointment.hasPrescription && (
                    <Button
                      className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => setShowPrescriptionModal(true)}
                    >
                      <FileText size={16} />
                      {t("appointment:viewPrescription")}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {appointment.status === "Completed" && appointment.hasPrescription && (
                    <Button
                      onClick={() => setShowPatientPrescriptionModal(true)}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      {t("appointment:viewPrescription")}
                    </Button>
                  )}

                  {appointment.status === "Completed" && !appointment.isRated && (
                    <Button
                      onClick={() => setShowRatingModal(true)}
                      className="gap-2 bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Star size={16} />
                      {t("appointment:rateAppointment")}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                    {variant === "doctor" ? t("appointment:patientComplaint") : t("appointment:symptoms")}:
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {appointment.symptoms || t("appointment:noSymptomsDescription")}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                    {t("appointment:appointmentDetails")}:
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("appointment:type")}:</span>
                      <span className="font-medium">{t(`appointment:type.${appointment.type}`)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("appointment:paymentStatus")}:</span>
                      <span className={`font-medium ${appointment.paymentStatus === 'paid' ? 'text-green-600' : appointment.paymentStatus === 'pending' ? 'text-orange-600' : 'text-red-600'}`}>
                        {t(`appointment:payment.${appointment.paymentStatus}`)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("appointment:createdAt")}:</span>
                      <span className="font-medium">
                        {format(new Date(appointment.createdAt), "d MMM yyyy, HH:mm", { locale: i18n.language === "ar" ? ar : undefined })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPrescriptionModal && variant === "doctor" && (
        <PrescriptionModal
          appointmentId={appointment._id}
          patientName={displayData.name}
          patientId={displayData.info?._id || appointment.patientId}
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          onSuccess={() => {
            onActionComplete?.();
            setShowPrescriptionModal(false);
          }}
          existingPrescription={appointment.hasPrescription ? prescriptionData?.data : null}
        />
      )}

      {showPatientPrescriptionModal && variant === "patient" && (
        <PatientPrescriptionModal
          appointmentId={appointment._id}
          doctorName={displayData.name}
          isOpen={showPatientPrescriptionModal}
          onClose={() => setShowPatientPrescriptionModal(false)}
        />
      )}

      {showRatingModal && variant === "patient" && (
        <RatingModal
          appointmentId={appointment._id}
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSuccess={() => {
            onActionComplete?.();
            setShowRatingModal(false);
          }}
        />
      )}
    </>
  );
};