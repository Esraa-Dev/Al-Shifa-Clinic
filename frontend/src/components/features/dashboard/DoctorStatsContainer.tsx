import { Calendar, Banknote, Video, Stethoscope, XCircle } from "lucide-react";
import { StatCard } from "../dashboard/StatsCard";

export const DoctorStatsContainer = ({ stats }: { stats: any }) => {
    const statItems = [
        {
            title: "Total Appointments",
            value: stats?.totalAppointments || 0,
            icon: <Calendar size={24} />,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "Total Revenue",
            value: `${stats?.totalRevenue?.toLocaleString() || 0} £`,
            icon: <Banknote size={24} />,
            bgColor: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "Online Consultations",
            value: stats?.onlineConsultations || 0,
            icon: <Video size={24} />,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "Clinic Consultations",
            value: stats?.clinicConsultations || 0,
            icon: <Stethoscope size={24} />,
            bgColor: "bg-orange-100",
            iconColor: "text-orange-600"
        },
        {
            title: "Cancelled Appointments",
            value: stats?.cancelledAppointments || 0,
            icon: <XCircle size={24} />,
            bgColor: "bg-red-100",
            iconColor: "text-red-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-4">
            {statItems.map((item, index) => (
                <StatCard key={index} {...item} />
            ))}
        </div>
    );
};