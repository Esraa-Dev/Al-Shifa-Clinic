import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGetDepartment } from "../../../hooks/department/useGetDepartment";
import type { Department } from "../../../types/types";
import { SpecialityMenuSkeleton } from "./SpecialityMenuSkeleton";

const SpecialityMenu = () => {
  const { t, i18n } = useTranslation("departments");
  const { data, isLoading, isError } = useGetDepartment(1, 10, "");
  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">{t('departments:failedToLoad')}</div>
    );
  }

  const departments = data?.departments || [];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-40 -translate-x-40"></div>

      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primaryText mb-3">
            {t('departments:title')}
          </h2>
          <p className="text-secondary text-lg mb-4">
            {t('departments:subtitle')}
          </p>
          <div className="w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto"></div>
        </div>

        {isLoading ? (
          <SpecialityMenuSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {departments.map((item: Department) => (
              <Link
                key={item._id}
                onClick={() => window.scrollTo(0, 0)}
                className="group relative bg-background border border-primaryBorder rounded-2xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                to={`/doctor-list?department=${item._id}`}
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="space-y-2">
                    <div className="w-14 h-14 bg-linear-to-br from-primary to-secondary rounded-2xl flex-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt={i18n.language === 'ar' ? item.name_ar : item.name_en}
                          className="w-8 h-8 object-contain brightness-0 invert"
                        />
                      ) : (
                        <img
                          src="/src/assets/icons/headset.svg"
                          alt={i18n.language === 'ar' ? item.name_ar : item.name_en}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-primaryText group-hover:text-primary transition-colors duration-300">
                      {i18n.language === 'ar' ? item.name_ar : item.name_en}
                    </h3>
                    <p className="text-secondary text-sm font-medium">
                      {item.doctorCount || 0} {t('departments:doctors')}
                    </p>
                    <p className="text-primaryText/70 text-sm mt-2 leading-relaxed">
                      {i18n.language === 'ar'
                        ? (item.description_ar || t('departments:noDescription'))
                        : (item.description_en || t('departments:noDescription'))}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialityMenu;