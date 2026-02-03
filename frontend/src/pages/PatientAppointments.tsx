import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetPatientAppointments } from "../hooks/appointment/useGetPatientAppointments";
import { useTranslation } from "react-i18next";
import type { Appointment } from "../types/types";
import { AppointmentCard } from "../components/features/book-appointment/AppointmentCard";
import { AppointmentSkeleton } from "../components/features/book-appointment/AppointmentSkeleton";
import { Button } from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import { useSocket } from "../context/SocketContext";

const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetPatientAppointments({ page: currentPage, limit: 10 });
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { t } = useTranslation();

  const appointmentsData = data?.data?.appointments || data?.appointments || [];
  const pagination = data?.data?.pagination || data?.pagination || { totalPages: 1 };

  const filteredAppointments = appointmentsData.filter((app: Appointment) => {
    if (activeTab === "upcoming") return ["Scheduled", "In Progress"].includes(app.status);
    if (activeTab === "completed") return app.status === "Completed";
    if (activeTab === "cancelled") return app.status === "Cancelled";
    return true;
  });

  const getTabCount = (tab: string) => {
    return appointmentsData.filter((app: Appointment) => {
      if (tab === "upcoming") return ["Scheduled", "In Progress"].includes(app.status);
      return tab === "completed" ? app.status === "Completed" : app.status === "Cancelled";
    }).length;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDoctorId = (appointment: Appointment) => {
    if (!appointment.doctorId) return "";
    return typeof appointment.doctorId === 'string' ? appointment.doctorId : appointment.doctorId._id;
  };

  useEffect(() => {
    if (!socket) return;
    
    socket.on("get-online-users", (users: string[]) => {
      setOnlineUsers(users);
    });
    
    return () => {
      socket.off("get-online-users");
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("get-online-users");
    }
  }, [socket]);

  const checkIfDoctorIsOnline = (appointment: Appointment) => {
    const doctorId = getDoctorId(appointment);
    return onlineUsers.includes(doctorId);
  };

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primaryText mb-3">{t("appointment:dashboard.myAppointments")}</h1>
          <p className="text-secondary text-lg">{t("appointment:dashboard.manageMedicalAppointments")}</p>
        </div>

        <div className="flex border-b border-primaryBorder mb-8">
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
              className={`flex-1 py-4 text-center font-medium cursor-pointer border-b-2 transition-colors ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-primaryText hover:text-primary"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{t(`appointment:dashboard.${tab}`)}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full min-w-6">
                  {getTabCount(tab)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {isLoading ? (
          <AppointmentSkeleton />
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12 flex justify-center flex-col items-center gap-2">
            <Calendar className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-primaryText text-lg">{t(`appointment:dashboard.no${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}Appointments`)}</p>
            {activeTab === "upcoming" && (
              <Button onClick={() => window.location.href = '/doctor-list'} className="mt-4 w-fit">
                {t("appointment:dashboard.bookNewAppointment")}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {filteredAppointments.map((appointment: Appointment) => (
                <AppointmentCard 
                  key={appointment._id} 
                  appointment={appointment} 
                  isOnline={checkIfDoctorIsOnline(appointment)}
                  variant="patient" 
                />
              ))}
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default PatientAppointments;