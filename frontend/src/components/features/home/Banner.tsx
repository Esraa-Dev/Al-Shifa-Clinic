import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetHomeStats } from "../../../hooks/stats/useGetHomeStats";
import { StatsSkeleton } from "./StatsSkeleton";

export const Banner = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { data, isLoading } = useGetHomeStats();
    
    const isRTL = i18n.language === 'ar';

    return (
        <div className="relative bg-linear-to-r from-primary to-secondary overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full -translate-y-16 translate-x-16 md:-translate-y-32 md:translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 bg-white rounded-full translate-y-20 -translate-x-20 md:translate-y-40 md:-translate-x-40"></div>
            </div>

            <div className="container relative py-12 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div className={`text-white ${isRTL ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight max-w-3xl mx-auto lg:mx-0">
                            {t("hero.title")}
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {t("hero.subtitle")}
                        </p>
                        <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 ${isRTL ? 'lg:justify-end' : 'lg:justify-start'} justify-center mt-4`}>
                            <button
                                onClick={() => { navigate("/register"); window.scrollTo(0, 0); }}
                                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-5 md:px-7 lg:px-8 py-3 md:py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all cursor-pointer w-full sm:w-auto text-sm md:text-base shadow-lg shadow-black/5"
                            >
                                <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="whitespace-nowrap">{t("hero.register")}</span>
                            </button>

                            <Link
                                to="/doctor-list"
                                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-5 md:px-7 lg:px-8 py-3 md:py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all w-full sm:w-auto text-sm md:text-base"
                            >
                                <span className="whitespace-nowrap">{t("hero.book_now")}</span>
                            </Link>
                        </div>
                    </div>

                    {isLoading ? (
                        <StatsSkeleton />
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-white text-center border border-white/10 flex flex-col justify-center">
                                <div className="text-xl md:text-3xl font-bold mb-1">{data?.data?.doctors}+</div>
                                <div className="text-[10px] sm:text-xs md:text-sm opacity-90 uppercase tracking-wider">{t("stats.doctors")}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-white text-center border border-white/10 flex flex-col justify-center">
                                <div className="text-xl md:text-3xl font-bold mb-1">{data?.data?.specialties}+</div>
                                <div className="text-[10px] sm:text-xs md:text-sm opacity-90 uppercase tracking-wider">{t("stats.specialties")}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-white text-center border border-white/10 flex flex-col justify-center">
                                <div className="text-xl md:text-3xl font-bold mb-1">{data?.data?.appointments}+</div>
                                <div className="text-[10px] sm:text-xs md:text-sm opacity-90 uppercase tracking-wider">{t("stats.appointments")}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-white text-center border border-white/10 flex flex-col justify-center">
                                <div className="text-xl md:text-3xl font-bold mb-1">{data?.data?.satisfaction}%</div>
                                <div className="text-[10px] sm:text-xs md:text-sm opacity-90 uppercase tracking-wider">{t("stats.satisfaction")}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};