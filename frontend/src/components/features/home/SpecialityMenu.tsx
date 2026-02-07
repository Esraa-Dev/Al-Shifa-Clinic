import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGetDepartment } from "../../../hooks/department/useGetDepartment";
import type { Department } from "../../../types/types";
import { SpecialityMenuSkeleton } from "./SpecialityMenuSkeleton";

export const SpecialityMenu = () => {
  const { t, i18n } = useTranslation("departments");
  const { data, isLoading, isError } = useGetDepartment(1, 10, "");

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">{t('departments:failedToLoad')}</div>
    );
  }

  const departments = data?.departments || [];

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="hidden sm:block absolute top-0 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-primary/5 rounded-full -translate-y-24 translate-x-24 lg:-translate-y-32 lg:translate-x-32"></div>
      <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 lg:w-80 lg:h-80 bg-secondary/5 rounded-full translate-y-32 -translate-x-32 lg:translate-y-40 lg:-translate-x-40"></div>

      <div className="container px-4 mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primaryText mb-3">
            {t('departments:title')}
          </h2>
          <p className="text-secondary text-base md:text-lg mb-4 max-w-2xl mx-auto">
            {t('departments:subtitle')}
          </p>
          <div className="w-16 md:w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto"></div>
        </div>

        {isLoading ? (
          <SpecialityMenuSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {departments.map((item: Department) => (
              <Link
                key={item._id}
                onClick={() => window.scrollTo(0, 0)}
                className="group relative bg-background border border-primaryBorder rounded-2xl p-5 md:p-6 hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
                to={`/doctor-list?department=${item._id}`}
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-linear-to-br from-primary to-secondary rounded-xl md:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt={i18n.language === 'ar' ? item.name_ar : item.name_en}
                        className="w-6 h-6 md:w-8 md:h-8 object-contain brightness-0 invert"
                      />
                    ) : (
                      <img
                        src="/src/assets/icons/headset.svg"
                        className="w-6 h-6 md:w-8 md:h-8 object-contain"
                        alt="headset"
                      />
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-primaryText group-hover:text-primary transition-colors duration-300 mb-1">
                    {i18n.language === 'ar' ? item.name_ar : item.name_en}
                  </h3>

                  <p className="text-secondary text-xs md:text-sm font-semibold mb-3">
                    {item.doctorCount || 0} {t('departments:doctors')}
                  </p>

                  <p className="text-primaryText/70 text-sm leading-relaxed line-clamp-3">
                    {i18n.language === 'ar'
                      ? (item.description_ar || t('departments:noDescription'))
                      : (item.description_en || t('departments:noDescription'))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
