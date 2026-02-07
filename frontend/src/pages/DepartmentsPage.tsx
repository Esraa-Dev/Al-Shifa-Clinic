import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetDepartment } from "../hooks/department/useGetDepartment";
import Pagination from "../components/ui/Pagination";
import DepartmentsHeader from "../components/features/departments/DepartmentsHeader";
import DepartmentsResults from "../components/features/departments/DepartmentsResults";

const DepartmentsPage = () => {
  const { t } = useTranslation("departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetDepartment(page, 10, searchQuery);
  const departments = data?.departments || [];
  const pagination = data?.pagination;

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">{t('departments.failedToLoad')}</div>
    );
  }

  return (
    <section className="min-h-screen bg-background py-6 md:py-12">
      <div className="container">
        <DepartmentsHeader
          title={t("departments:title")}
          subtitle={t("departments:subtitle")}
          searchPlaceholder={t("departments:searchPlaceholder")}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
        />

        <DepartmentsResults
          isLoading={isLoading}
          departments={departments}
        />

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </section>
  );
};

export default DepartmentsPage;