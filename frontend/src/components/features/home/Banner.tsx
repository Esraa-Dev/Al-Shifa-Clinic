import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetHomeStats } from "../../../hooks/stats/useGetHomeStats";
import { StatsSkeleton } from "./StatsSkeleton";


const Banner = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data, isLoading } = useGetHomeStats();

    return (
        <div className="relative bg-linear-to-r from-primary to-secondary overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full translate-y-40 -translate-x-40"></div>
            </div>

            <div className="container relative py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {t("hero.title")}
                        </h1>
                        <p className="text-xl mb-8 opacity-90 leading-relaxed">
                            {t("hero.subtitle")}
                        </p>

                        <div className={`flex flex-col sm:flex-row gap-3`}>
                            <button onClick={() => { navigate("/register"), scrollTo(0, 0) }} className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors cursor-pointer">
                                <UserPlus className="w-5 h-5" />
                                {t("hero.register")}
                            </button>
                            <Link to="/doctor-list" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                                {t("hero.book_now")}
                            </Link>
                        </div>
                    </div>

                    {isLoading ? (
                        <StatsSkeleton />
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                                <div className="text-3xl font-bold mb-2">{data?.data?.doctors}+</div>
                                <div className="text-sm opacity-90">{t("stats.doctors")}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                                <div className="text-3xl font-bold mb-2">{data?.data?.specialties}+</div>
                                <div className="text-sm opacity-90">{t("stats.specialties")}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                                <div className="text-3xl font-bold mb-2">{data?.data?.appointments}+</div>
                                <div className="text-sm opacity-90">{t("stats.appointments")}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                                <div className="text-3xl font-bold mb-2">{data?.data?.satisfaction}%</div>
                                <div className="text-sm opacity-90">{t("stats.satisfaction")}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Banner;