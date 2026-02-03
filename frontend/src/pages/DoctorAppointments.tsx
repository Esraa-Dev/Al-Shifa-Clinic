import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetDoctorAppointments } from "../hooks/appointment/useGetDoctorAppointments";
import { useSocket } from "../context/SocketContext";
import type { Appointment } from "../types/types";
import { AppointmentCard } from "../components/features/book-appointment/AppointmentCard";
import { AppointmentSkeleton } from "../components/features/book-appointment/AppointmentSkeleton";
import Pagination from "../components/ui/Pagination";
import { useTranslation } from "react-i18next";

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetDoctorAppointments({ page: currentPage, limit: 10 });
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
      if (tab === "completed") return app.status === "Completed";
      if (tab === "cancelled") return app.status === "Cancelled";
      return false;
    }).length;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPatientId = (appointment: Appointment) => {
    if (!appointment.patientId) return "";
    return typeof appointment.patientId === 'string' ? appointment.patientId : appointment.patientId._id;
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

  const checkIfUserIsOnline = (appointment: Appointment) => {
    const patientId = getPatientId(appointment);
    return onlineUsers.includes(patientId);
  };

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primaryText mb-3">{t("appointment:dashboard.manageAppointments")}</h1>
          <p className="text-secondary text-lg">{t("appointment:dashboard.managePatientAppointments")}</p>
        </div>

        <div className="flex border-b border-primaryBorder mb-8">
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
              className={`flex-1 py-4 text-center font-medium border-b-2 cursor-pointer transition-colors ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-primaryText hover:text-primary"
              }`}
            >
              {t(`appointment:dashboard.${tab}`)}
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full ml-2 w-7 h-7 inline-flex items-center justify-center">
                {isLoading ? 0 : getTabCount(tab)}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <AppointmentSkeleton />
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-primaryText text-lg">{t(`appointment:dashboard.no${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}Appointments`)}</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {filteredAppointments.map((appointment: Appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  isOnline={checkIfUserIsOnline(appointment)}
                  variant="doctor"
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

export default DoctorAppointments;
