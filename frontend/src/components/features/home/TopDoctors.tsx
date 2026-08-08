import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGetTopDoctors } from "../../../hooks/doctor/useGetTopDoctors";
import type { Doctor } from "../../../types/types";
import { DoctorSkeleton } from "../doctor/DoctorSkeleton";
import { DoctorCard } from "../doctor/DoctorCard";

export const TopDoctors = () => {
  const { t } = useTranslation("doctorList");

  const {
    data: doctors = [],
    isPending,
    isFetching,
    isError,
    refetch
  } = useGetTopDoctors(4);

  const showSkeleton =
    isPending || (isFetching && doctors.length === 0);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primaryText mb-3">
            {t("doctorList:topDoctors.title")}
          </h2>

          <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">
            {t("doctorList:topDoctors.subtitle")}
          </p>
        </div>

        {showSkeleton && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <DoctorSkeleton key={index} />
            ))}
          </div>
        )}

        {!showSkeleton && isError && doctors.length === 0 && (
          <div className="min-h-[350px] flex flex-col items-center justify-center text-center">
            <p className="text-secondary mb-4">
              {t("doctorList:failedToLoad")}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition"
            >
              {t("doctorList:tryAgain", {
                defaultValue: "Try again"
              })}
            </button>
          </div>
        )}

        {!showSkeleton && doctors.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {doctors.map((doctor: Doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                />
              ))}
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
          </>
        )}
      </div>
    </section>
  );
};