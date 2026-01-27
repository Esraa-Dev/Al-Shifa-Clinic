import Loading from "../components/ui/Loading";
import { WelcomeCard } from "../components/features/dashboard/WelcomeCard";
import { useDoctorStats } from "../hooks/doctor/useGetDoctorStats";
import { DoctorStatsContainer } from "../components/features/dashboard/DoctorStatsContainer";
import { RecentAppointments } from "../components/features/doctor/RecentAppointments";

const DoctorDashboard = () => {
    const { data: stats, isLoading } = useDoctorStats();

    if (isLoading) return <Loading />;

    return (
        <section className="space-y-6">
            <WelcomeCard />
            <DoctorStatsContainer stats={stats} />
            <RecentAppointments appointments={stats.recentAppointments} />
        </section>
    );
};

export default DoctorDashboard;