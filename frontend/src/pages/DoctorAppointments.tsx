import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetDoctorAppointments } from "../hooks/appointment/useGetDoctorAppointments";
import { useSocket } from "../context/SocketContext";
import type { Appointment } from "../types/types";
import { AppointmentCard } from "../components/features/book-appointment/AppointmentCard";
import { AppointmentSkeleton } from "../components/features/book-appointment/AppointmentSkeleton";

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const { data: appointments = [], isLoading } = useGetDoctorAppointments();
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!socket) return;
    socket.on("get-online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("get-online-users");
    };
  }, [socket]);

  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    if (activeTab === "upcoming") {
      return appointment.status === "Scheduled" || appointment.status === "In Progress";
    }
    if (activeTab === "completed") {
      return appointment.status === "Completed";
    }
    if (activeTab === "cancelled") {
      return appointment.status === "Cancelled";
    }
    return true;
  });

  const getTabCount = (tab: string) => {
    if (tab === "upcoming") {
      return appointments.filter(
        (appointment: Appointment) =>
          appointment.status === "Scheduled" || appointment.status === "In Progress"
      ).length;
    }
    if (tab === "completed") {
      return appointments.filter((appointment: Appointment) => appointment.status === "Completed").length;
    }
    if (tab === "cancelled") {
      return appointments.filter((appointment: Appointment) => appointment.status === "Cancelled").length;
    }
    return 0;
  };

  const tabs = [
    { id: "upcoming", label: t("appointment:dashboard.upcoming") },
    { id: "completed", label: t("appointment:dashboard.completed") },
    { id: "cancelled", label: t("appointment:dashboard.cancelled") }
  ];

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case "upcoming": return t("appointment:dashboard.noUpcomingAppointments");
      case "completed": return t("appointment:dashboard.noCompletedAppointments");
      case "cancelled": return t("appointment:dashboard.noCancelledAppointments");
      default: return t("appointment:dashboard.noAppointments");
    }
  };

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primaryText mb-3">{t("appointment:dashboard.manageAppointments")}</h1>
          <p className="text-secondary text-lg">{t("appointment:dashboard.managePatientAppointments")}</p>
        </div>

        <div className="flex border-b border-primaryBorder mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "upcoming" | "completed" | "cancelled")}
              className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-primaryText hover:text-primary"
                }`}
            >
              {tab.label}
              <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                {isLoading ? 0 : getTabCount(tab.id)}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <AppointmentSkeleton />
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-primaryText text-lg">{getEmptyStateMessage()}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment: Appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                isOnline={onlineUsers.includes(appointment.patientId?._id)}
                variant="doctor"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorAppointments;