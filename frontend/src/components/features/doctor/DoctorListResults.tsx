import { Search } from "lucide-react";

import { EmptyState } from "../../ui/EmptyState";
import { DoctorSkeleton } from "./DoctorSkeleton";
import { useTranslation } from "react-i18next";
import type { Doctor, DoctorListResultsProps } from "../../../types/types";
import DoctorCard from "./DoctorCard";

const DoctorListResults = ({
    isLoading,
    doctors,
    totalDoctors,
    onClearFilters
}: DoctorListResultsProps) => {
    const { t } = useTranslation(["doctorList", "common"]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <DoctorSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (doctors.length === 0) {
        return (
            <EmptyState
                icon={Search}
                titleKey="doctorList:results.noDoctorsFound.title"
                descriptionKey="doctorList:results.noDoctorsFound.message"
                actionLabelKey="doctorList:actions.clearFilters"
                onAction={onClearFilters}
            />
        );
    }

    return (
        <>
            <div className="mb-4 text-gray-600">
                {t("doctorList:results.doctorsFound", {
                    count: totalDoctors,
                    plural: totalDoctors > 1 ? t("doctorList:results.pluralSuffix") : ""
                })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {doctors.map((doctor: Doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
            </div>
        </>
    );
};

export default DoctorListResults;