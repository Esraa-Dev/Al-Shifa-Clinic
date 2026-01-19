import { Calendar } from "lucide-react";
import { DoctorAppointmentCard } from "../components/features/dashboard/DoctorAppointmentCard";
import { useGetDoctorAppointments } from "../hooks/appointment/useGetDoctorAppointments";
import type { Appointment } from "../types/types";
import { useEffect, useState } from "react";
import { APPOINTMENTS_TABS } from "../constants/constants";
import { useSocket } from "../context/SocketContext";

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const { data: appointments = [], isLoading } = useGetDoctorAppointments();
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("get-online-users", (users: string[]) => {
      console.log(users)
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

  if (isLoading) {
    return (
      <div className="py-12 bg-background min-h-screen">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primaryText mb-3">إدارة المواعيد</h1>
          <p className="cleartext-secondary text-lg">إدارة وحجز مواعيد المرضى</p>
        </div>

        <div className="flex border-b border-primaryBorder mb-8">
          {APPOINTMENTS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "upcoming" | "completed" | "cancelled")}
              className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-primaryText hover:text-primary"
                }`}
            >
              {tab.label}
              <span className="mr-2 text-sm bg-primary/10 px-2 py-1 rounded-full">
                {getTabCount(tab.id)}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-primaryText text-lg">
                {activeTab === "upcoming" && "لا توجد مواعيد قادمة"}
                {activeTab === "completed" && "لا توجد مواعيد مكتملة"}
                {activeTab === "cancelled" && "لا توجد مواعيد ملغية"}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment: Appointment) => (
              <DoctorAppointmentCard key={appointment._id} appointment={appointment} isOnline={onlineUsers.includes(appointment.patientId?._id)} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorAppointments;