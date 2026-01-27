import { Users, UserCheck, Calendar, Banknote } from "lucide-react";
import { StatCard } from "./StatsCard";

export const AdminStatsContainer = ({ totalDoctors, totalPatients, totalAppointments, totalRevenue }: { totalDoctors: number, totalPatients: number, totalAppointments: number, totalRevenue: number }) => {
    const statItems = [
        {
            title: "Total Doctors",
            value:totalDoctors || 0,
            icon: <UserCheck size={24} />,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "Total Patients",
            value:totalPatients || 0,
            icon: <Users size={24} />,
            bgColor: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "Appointments",
            value:totalAppointments || 0,
            icon: <Calendar size={24} />,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "Total Revenue",
            value: `${totalRevenue?.toLocaleString() || 0} £`,
            icon: <Banknote size={24} />,
            bgColor: "bg-orange-100",
            iconColor: "text-orange-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {statItems.map((item, index) => (
                <StatCard key={index} {...item} />
            ))}
        </div>
    );
};