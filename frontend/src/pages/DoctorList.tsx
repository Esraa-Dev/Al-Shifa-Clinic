import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetDoctors } from "../hooks/doctor/useGetDoctors";
import { useGetDepartment } from "../hooks/department/useGetDepartment";
import { useTranslation } from "react-i18next";
import type { DoctorFilters } from "../types/types";
import Pagination from "../components/ui/Pagination";
import DoctorListHeader from "../components/features/doctor/DoctorListHeader";
import DoctorListFilters from "../components/features/doctor/DoctorListFilters";
import DoctorListResults from "../components/features/doctor/DoctorListResults";

const DoctorListPage = () => {
  const { t } = useTranslation(["doctorList", "common"]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const department = params.get("department");

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(department);
  const [filters, setFilters] = useState<DoctorFilters>({
    search: "",
    department: department,
    fee: null,
    experience: null,
    schedule: null,
    sortBy: "experience",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setFilters(prev => ({ ...prev, department: selectedDepartment }));
  }, [selectedDepartment]);

  const { data: departmentData, isLoading: isDepartmentLoading } = useGetDepartment();
  const { data: doctorsData = {}, isLoading: isDoctorLoading } = useGetDoctors({ ...filters, page, limit: 8 })
  const pagination = doctorsData?.pagination || { currentPage: 1, totalPages: 1 };

  const clearFilters = () => {
    setFilters({
      search: "",
      department: department,
      fee: null,
      experience: null,
      schedule: null,
      sortBy: "experience",
    });
    setSelectedDepartment(department);
  };

  const handleExperienceChange = (value: string) => {
    const numValue = value === "" ? null : Number(value);
    setFilters(prev => ({ ...prev, experience: numValue }));
  };

  const handleFeeChange = (value: string) => {
    const numValue = value === "" ? null : Number(value);
    setFilters(prev => ({ ...prev, fee: numValue }));
  };

  const handleScheduleChange = (value: string) => {
    setFilters(prev => ({ ...prev, schedule: value || null }));
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container">
        <div className="bg-white p-8 rounded-4xl mb-8 border border-primaryBorder">
          <DoctorListHeader 
            title={t("doctorList:title")} 
            subtitle={t("doctorList:subtitle")} 
            searchPlaceholder={t("doctorList:search")}
            onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
            onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            toggleFiltersLabel={t("doctorList:toggleAdvancedFilters")}
          />
          
          <DoctorListFilters
            isDepartmentLoading={isDepartmentLoading}
            departmentData={departmentData}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            filters={filters}
            onExperienceChange={handleExperienceChange}
            onFeeChange={handleFeeChange}
            onScheduleChange={handleScheduleChange}
            onSortChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      <div className="container">
        <DoctorListResults
          isLoading={isDoctorLoading}
          doctors={doctorsData.doctors || []}
          totalDoctors={doctorsData.doctors?.length || 0}
          onClearFilters={clearFilters}
        />
        
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
};

export default DoctorListPage;