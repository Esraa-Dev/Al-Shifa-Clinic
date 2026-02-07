import { useTranslation } from "react-i18next";
import { useGetTopDoctors } from "../../../hooks/doctor/useGetTopDoctors";
import type { Doctor } from "../../../types/types";
import { DoctorSkeleton } from "../doctor/DoctorSkeleton";
import { Link } from "react-router-dom";
import { DoctorCard } from "../doctor/DoctorCard";

export const TopDoctors = () => {
  const { t } = useTranslation("doctorList");
  const { data: doctors = [], isLoading, isError } = useGetTopDoctors(4);

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        {t('doctorList:failedToLoad')}
      </div>
    );
  }

  return (
    <section className="container pb-12 md:pb-20">
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primaryText mb-3">
          {t("doctorList:topDoctors.title")}
        </h2>
        <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">
          {t("doctorList:topDoctors.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          [...Array(4)].map((_, index) => (
            <DoctorSkeleton key={index} />
          ))
        ) : (
          doctors.map((doctor: Doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
            />
          ))
        )}
      </div>

      <div className="text-center mt-10 md:mt-14">
        <Link
          to="/doctor-list"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-block w-full sm:w-auto px-10 py-3.5 border border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300"
        >
          {t("doctorList:topDoctors.viewAll")}
        </Link>
      </div>
    </section>
  );
};
