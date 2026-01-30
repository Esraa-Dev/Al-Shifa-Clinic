import { WelcomeCard } from "../components/features/dashboard/WelcomeCard";
import { AdminStatsContainer } from '../components/features/dashboard/AdminStatsContainer';
import { AllAppointmentsTable } from '../components/features/admin/AllAppointmentsTable';
import { DepartmentsChart } from "../components/features/admin/DepartmentsChart";
import { AppointmentStatistics } from "../components/features/admin/AppointmentStatistics";
import { TopPatients } from "../components/features/admin/TopPatients";
import { DoctorsSchedule } from "../components/features/admin/DoctorsSchedule";
import { DashboardTableSkeleton } from "../components/features/dashboard/DashboardTableSkeleton";
import { useDashboardStats } from "../hooks/admin/useDashboardStats";

const AdminDashboard = () => {
    const { data: stats, isLoading } = useDashboardStats();

    return (
        <section className="space-y-4">
            <div className="flex flex-col gap-4">
                <WelcomeCard />
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-primaryBorder animate-pulse">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
                                        <div className="h-8 bg-gray-100 rounded w-16"></div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gray-100">
                                        <div className="w-6 h-6"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AdminStatsContainer
                        totalDoctors={stats?.totalDoctors || 0}
                        totalPatients={stats?.totalPatients || 0}
                        totalAppointments={stats?.totalAppointments || 0}
                        totalRevenue={stats?.totalRevenue || 0}
                    />
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-48 mb-4"></div>
                        <div className="h-64 bg-gray-100 rounded"></div>
                    </div>
                ) : (
                    <AppointmentStatistics stats={stats?.appointmentStats || []} />
                )}
                {isLoading ? (
                    <div className="bg-white  rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-48 mb-4"></div>
                        <div className="w-72 h-72 rounded-full mx-auto bg-gray-100"></div>
                    </div>
                ) : (
                    <DepartmentsChart stats={stats?.departmentStats || []} />
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-48 mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                        <div>
                                            <div className="h-4 bg-gray-100 rounded w-32"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-100 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <TopPatients patients={stats?.topPatients || []} />
                )}
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-48 mb-4"></div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="h-8 bg-gray-300 rounded w-12 mx-auto mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="h-8 bg-gray-300 rounded w-12 mx-auto mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-2">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-100 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-100 rounded w-24"></div>
                                    </div>
                                    <div className="h-6 bg-gray-100 rounded w-20"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <DoctorsSchedule doctorsData={stats?.doctorsStatus || { available: 0, unavailable: 0, list: [] }} />
                )}
            </div>

            {isLoading ? (
                <DashboardTableSkeleton />
            ) : (
                <AllAppointmentsTable appointments={stats?.allAppointments || []} />
            )}
        </section>
    );
};

export default AdminDashboard;