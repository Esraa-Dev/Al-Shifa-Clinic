import { Star, MapPin, Calendar, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetTopDoctors } from "../../../hooks/doctor/useGetTopDoctors";
import type { Doctor } from "../../../types/types";
import { DoctorSkeleton } from "../doctor/DoctorSkeleton";
import { Link } from "react-router-dom";

const TopDoctors = () => {
  const { t, i18n } = useTranslation("doctorList");
  const { data: doctors = [], isLoading, isError } = useGetTopDoctors(4);

  const location = i18n.language === 'ar' 
    ? 'مدينة نصر، شارع مكرم عبيد، برج الأطباء  '
    : 'Nasr City, Makram Ebeid Street, Doctors Tower ';

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">{t('doctorList:failedToLoad')}</div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primaryText mb-3">
            {t("doctorList:topDoctors.title")}
          </h2>
          <p className="text-secondary text-lg">
            {t("doctorList:topDoctors.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, index) => <DoctorSkeleton key={index} />)
          ) : (
            doctors.map((doctor: Doctor) => {
              const specialization = i18n.language === 'ar' 
                ? doctor.specialization_ar || doctor.specialization_en || t("doctorList:common.specialtyNotSpecified")
                : doctor.specialization_en || doctor.specialization_ar || t("doctorList:common.specialtyNotSpecified");
              
              const qualification = i18n.language === 'ar' 
                ? doctor.qualification_ar || doctor.qualification_en || ""
                : doctor.qualification_en || doctor.qualification_ar || "";

              return (
                <div
                  key={doctor._id}
                  className="bg-white rounded-xl border border-primaryBorder overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-48 overflow-hidden relative">
                    <img
                      src={doctor.image || "/default-doctor.jpg"}
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center justify-center gap-1 bg-white/95 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-primaryText">
                        {doctor.rating?.toFixed(1) || 0}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-primaryText text-lg mb-1">
                        {i18n.language === 'ar' ? 'د. ' : 'Dr. '}{doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-primary font-medium">
                        {specialization}
                      </p>
                    </div>

                    {qualification && (
                      <div className="flex items-start gap-2 mb-3 text-sm text-secondary">
                        <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{qualification}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mb-3 text-sm text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{doctor.experience || 0} {t("doctorList:common.yearsExperience")}</span>
                    </div>

                    <div className="flex items-start gap-2 mb-4 text-sm text-primaryText">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-primaryBorder">
                      <div>
                        <span className="text-xl font-bold text-primary">
                          {doctor.fee || 0}
                        </span>
                        <span className="text-primaryText text-sm"> {t("doctorList:common.currency")}</span>
                      </div>

                      <button 
                        onClick={() => window.location.href = `/doctor/${doctor._id}`}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition-colors cursor-pointer"
                      >
                        {t("doctorList:topDoctors.book")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/doctor-list"
            className="px-8 py-3 cursor-pointer border border-primary text-primary rounded-xl hover:border-secondary hover:text-secondary transition-colors"
          >
            {t("doctorList:topDoctors.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;