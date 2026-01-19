import { X } from "lucide-react";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";
import type { Department, DoctorListFiltersProps } from "../../../types/types";


const DoctorListFilters = ({
  isDepartmentLoading,
  departmentData,
  selectedDepartment,
  setSelectedDepartment,
  showAdvancedFilters,
  setShowAdvancedFilters,
  filters,
  onExperienceChange,
  onFeeChange,
  onScheduleChange,
  onSortChange,
  onClearFilters
}: DoctorListFiltersProps) => {
  const { t, i18n } = useTranslation(["doctorList", "common"]);

  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-primaryText mb-2">{t("doctorList:browseByDepartment")}</h3>
      <div className="flex flex-wrap gap-2 p-2 shadow-sm">
        <button
          onClick={() => setSelectedDepartment(null)}
          className={`px-4 py-2 rounded-4xl text-sm transition-colors duration-200 border-2 border-white cursor-pointer ${selectedDepartment === null ? "bg-primary text-white" : "text-primaryText bg-primary/10"}`}
        >
          {t("doctorList:allDepartments")}
        </button>

        {isDepartmentLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-4xl text-sm bg-background animate-pulse flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-secondary/5"></div>
                <div className="h-3 bg-secondary/5 rounded w-16"></div>
              </div>
            ))}
          </>
        ) : (
          departmentData?.departments.map((dept: Department) => (
            <button
              key={dept._id}
              onClick={() => setSelectedDepartment(dept._id)}
              className={`px-4 py-2 rounded-4xl text-sm transition-colors duration-200 border-2 border-white cursor-pointer flex items-center gap-2 ${selectedDepartment === dept._id ? "bg-primary text-white" : "text-primaryText bg-primary/10"}`}
            >
              {dept.icon && (
                <img
                  src={dept.icon}
                  alt={i18n.language === 'ar' ? dept.name_ar : dept.name_en}
                  className={`w-5 h-5 object-contain ${selectedDepartment === dept._id ? "brightness-150!" : "brightness-0!"}`}
                />
              )}
              <span>{i18n.language === 'ar' ? dept.name_ar : dept.name_en}</span>
            </button>
          ))
        )}
      </div>

      {showAdvancedFilters && (
        <div className="p-6 mt-8 bg-primary/5 relative rounded-4xl" dir={i18n.dir()}>
          <div className="flex justify-between mb-4">
            <Button
              onClick={() => setShowAdvancedFilters(false)}
              className={`p-1! absolute ${i18n.dir() === 'rtl' ? 'left-4' : 'right-4'} top-4 shadow-2xl`}
            >
              <X className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold w-full">{t("doctorList:advancedFilters")}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-2 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
                {t("doctorList:filters.experience.label")}
              </label>
              <input
                type="number"
                placeholder={t("doctorList:filters.experience.placeholder")}
                className="bg-white p-2 rounded-md w-full outline-none border border-primaryBorder"
                value={filters.experience ?? ""}
                onChange={e => onExperienceChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-2 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
                {t("doctorList:filters.fee.label")}
              </label>
              <input
                type="number"
                placeholder={t("doctorList:filters.fee.placeholder")}
                className="bg-white p-2 rounded-md w-full outline-none border border-primaryBorder"
                value={filters.fee ?? ""}
                onChange={e => onFeeChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-2 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
                {t("doctorList:filters.schedule.label")}
              </label>
              <select
                title={t("doctorList:filters.schedule.label")}
                aria-label={t("doctorList:filters.schedule.label")}
                className="bg-white focus:outline-0 p-2 rounded-md text-sm outline-none border border-primaryBorder"
                value={filters.schedule || ""}
                onChange={e => onScheduleChange(e.target.value)}
              >
                <option value="">{t("doctorList:filters.schedule.options.all")}</option>
                <option value="monday">{t("doctorList:filters.schedule.options.monday")}</option>
                <option value="tuesday">{t("doctorList:filters.schedule.options.tuesday")}</option>
                <option value="wednesday">{t("doctorList:filters.schedule.options.wednesday")}</option>
                <option value="thursday">{t("doctorList:filters.schedule.options.thursday")}</option>
                <option value="friday">{t("doctorList:filters.schedule.options.friday")}</option>
                <option value="saturday">{t("doctorList:filters.schedule.options.saturday")}</option>
                <option value="sunday">{t("doctorList:filters.schedule.options.sunday")}</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-2 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
                {t("doctorList:filters.sortBy.label")}
              </label>
              <select
                title={t("doctorList:filters.sortBy.label")}
                aria-label={t("doctorList:filters.sortBy.label")}
                className="bg-white focus:outline-0 p-2 rounded-md text-sm outline-none border border-primaryBorder"
                value={filters.sortBy}
                onChange={e => onSortChange(e.target.value)}
              >
                <option value="experience">{t("doctorList:filters.sortBy.options.experience")}</option>
                <option value="fee">{t("doctorList:filters.sortBy.options.fee")}</option>
                <option value="rating">{t("doctorList:filters.sortBy.options.rating")}</option>
                <option value="name">{t("doctorList:filters.sortBy.options.name")}</option>
              </select>
            </div>
          </div>

          <div className={`flex ${i18n.dir() === 'rtl' ? 'justify-start' : 'justify-end'} gap-2`}>
            <Button onClick={onClearFilters}>
              {t("doctorList:actions.clearAllFilters")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorListFilters;