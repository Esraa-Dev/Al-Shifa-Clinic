import { useTranslation } from "react-i18next";
import { useGetTopDoctors } from "../../../hooks/doctor/useGetTopDoctors";
import type { Doctor } from "../../../types/types";
import { DoctorSkeleton } from "../doctor/DoctorSkeleton";
import { Link } from "react-router-dom";
import { DoctorCard } from "../doctor/DoctorCard";

const TopDoctors = () => {
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
    <section className="py-16">
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

        <div className="text-center mt-12">
          <Link
            to="/doctor-list"
            onClick={() => window.scrollTo(0, 0)}
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