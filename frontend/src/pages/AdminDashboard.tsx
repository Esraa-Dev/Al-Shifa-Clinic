import Loading from "../components/ui/Loading";
import { useDashboardStats } from "../hooks/admin/useDashboardStats";
import { WelcomeCard } from "../components/features/dashboard/WelcomeCard";
import { AdminStatsContainer } from '../components/features/dashboard/AdminStatsContainer';
import { AllAppointmentsTable } from '../components/features/admin/AllAppointmentsTable';


const AdminDashboard = () => {
    const { data: stats, isLoading } = useDashboardStats();

    if (isLoading) return <Loading />;

    return (
        <section className="space-y-6">
            <WelcomeCard />
            <AdminStatsContainer stats={stats} />
            <AllAppointmentsTable appointments={stats?.allAppointments || []} />
        </section>
    );
};

export default AdminDashboard;