import { WelcomeCard } from "../components/features/dashboard/WelcomeCard";
import { useDoctorStats } from "../hooks/doctor/useGetDoctorStats";
import { DoctorStatsContainer } from "../components/features/dashboard/DoctorStatsContainer";
import { RecentAppointments } from "../components/features/doctor/RecentAppointments";
import { AppointmentStatisticsChart } from "../components/features/doctor/AppointmentStatisticsChart";
import { AvailabilityCard } from "../components/features/doctor/AvailabilityCard";
import { UpcomingAppointmentsCard } from "../components/features/doctor/UpcomingAppointmentsCard";
import { TopPatientsCard } from "../components/features/doctor/TopPatientsCard";
import { DashboardTableSkeleton } from "../components/features/dashboard/DashboardTableSkeleton";

const DoctorDashboard = () => {
    const { data: stats, isLoading } = useDoctorStats();

    return (
        <section className="space-y-6">
            <div className="space-y-6">
                <WelcomeCard />
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <DoctorStatsContainer stats={stats} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-48 mb-6"></div>
                        <div className="flex justify-center items-center w-full gap-6">
                            <div className="relative h-[300px] w-[300px] mb-6">
                                <div className="w-full h-full rounded-full bg-gray-100"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="h-10 bg-gray-200 rounded w-16 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                            </div>
                            <div className="space-y-4 text-center">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                                        </div>
                                        <div className="h-6 bg-gray-200 rounded w-8"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <AppointmentStatisticsChart stats={stats?.appointmentStatusStats || []} />
                )}
                
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-32 mb-6"></div>
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="border border-primaryBorder rounded-lg p-4 bg-gray-100">
                                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <AvailabilityCard schedule={stats?.schedule || []} />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-32 mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                        <div>
                                            <div className="h-4 bg-gray-100 rounded w-32"></div>
                                            <div className="h-3 bg-gray-100 rounded w-16 mt-1"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-100 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <TopPatientsCard patients={stats?.topPatients || []} />
                )}
                
                {isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full animate-pulse">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="h-6 bg-gray-100 rounded w-40"></div>
                            <div className="h-6 bg-gray-100 rounded w-16"></div>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-gray-100 rounded-full"></div>
                                        <div>
                                            <div className="h-4 bg-gray-100 rounded w-28 mb-2"></div>
                                            <div className="h-3 bg-gray-100 rounded w-32"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-100 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <UpcomingAppointmentsCard appointments={stats?.upcomingAppointments || []} />
                )}
            </div>

            {isLoading ? (
                <DashboardTableSkeleton />
            ) : (
                <RecentAppointments appointments={stats?.recentAppointments || []} />
            )}
        </section>
    );
};

export default DoctorDashboard;