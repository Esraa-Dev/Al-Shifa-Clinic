import { Link } from "react-router-dom";
import { Search, Stethoscope } from "lucide-react";
import { EmptyState } from "../../ui/EmptyState";
import { useTranslation } from "react-i18next";
import type { Department, DepartmentsResultsProps } from "../../../types/types";
import { DepartmentSkeleton } from "./DepartmentSkeleton";
const DepartmentsResults = ({
  isLoading,
  departments
}: DepartmentsResultsProps) => {
  const { t, i18n } = useTranslation("departments");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <DepartmentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <EmptyState
        icon={Search}
        titleKey="departments:noResults.title"
        descriptionKey="departments:noResults.description"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {departments.map((department: Department) => (
        <div
          key={department._id}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-primaryBorder hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full"
        >
          <div className="p-5 md:p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full border border-primary text-primaryText p-3 shrink-0 flex items-center justify-center">
                {department.icon ? (
                  <img
                    src={department.icon}
                    alt={i18n.language === "ar" ? department.name_ar : department.name_en}
                    className="w-full h-full object-contain brightness-0!"
                  />
                ) : (
                  <div className="w-full h-full bg-primary rounded-full flex items-center justify-center p-2 text-white">
                    <Stethoscope className="w-full h-full" />
                  </div>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                {i18n.language === "ar" ? department.name_ar : department.name_en}
              </h3>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3 text-sm md:text-base grow">
              {i18n.language === "ar"
                ? department.description_ar || t("departments:noDescription")
                : department.description_en || t("departments:noDescription")}
            </p>

            <div className="flex items-center justify-between mb-6 py-2 border-t border-gray-50 mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  {t("departments:doctors")}:
                </span>
                <span className="text-lg font-bold text-primary">
                  {department.doctorCount || 0}
                </span>
              </div>
            </div>

            <Link
              to={`/doctor-list?department=${department._id}`}
              onClick={() => window.scrollTo(0, 0)}
              className="block w-full outline-1 outline-primary border-4 border-white text-center py-2 rounded-lg font-medium bg-primary text-white transition-colors"
            >
              {t("departments:viewDoctors")}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentsResults;