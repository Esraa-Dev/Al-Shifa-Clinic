import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { EmptyState } from "../../ui/EmptyState";
import { useTranslation } from "react-i18next";
import type { Department, DepartmentsResultsProps } from "../../../types/types";
import { DepartmentSkeleton } from "./DepartmentSkeleton";
import { Stethoscope } from 'lucide-react';
const DepartmentsResults = ({
  isLoading,
  departments
}: DepartmentsResultsProps) => {
  const { t, i18n } = useTranslation("departments");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department: Department) => (
        <div
          key={department._id}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-primaryBorder hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {department.icon ? (
                <div className="w-12 h-12 rounded-full border border-primary text-primaryText p-3">
                  <img
                    src={department.icon}
                    alt={i18n.language === "ar" ? department.name_ar : department.name_en}
                    className="w-full h-full object-contain brightness-0!"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-primaryText p-3">
                  <Stethoscope className="w-full h-full" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {i18n.language === "ar" ? department.name_ar : department.name_en}
              </h3>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {i18n.language === "ar"
                ? department.description_ar || t("departments:noDescription")
                : department.description_en || t("departments:noDescription")}
            </p>

            <div className="flex items-center justify-between mb-6">
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