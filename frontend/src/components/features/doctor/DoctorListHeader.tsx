import { Filter } from "lucide-react";
import { Button } from "../../ui/Button";
import { DoctorSearch } from "../../ui/DoctorSearch";
import type { DoctorListHeaderProps } from "../../../types/types";

const DoctorListHeader = ({
    title,
    subtitle,
    searchPlaceholder,
    onSearchChange,
    onToggleFilters,
    toggleFiltersLabel
}: DoctorListHeaderProps) => {
    return (
        <div className="mb-6 md:mb-8 px-4 md:px-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 md:gap-4 mt-4 md:mt-6">
                <div className="flex-1">
                    <DoctorSearch
                        placeholder={searchPlaceholder}
                        onSearchChange={onSearchChange}
                    />
                </div>

                <Button
                    type="button"
                    className="px-4 md:px-6 flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl md:rounded-2xl border border-primary bg-primary text-white hover:bg-primary/90 transition-all shadow-sm py-2.5 md:py-3"
                    onClick={onToggleFilters}
                >
                    <Filter size={18} />
                    <span className="font-medium text-sm md:text-base">{toggleFiltersLabel}</span>
                </Button>
            </div>
        </div>
    );
};

export default DoctorListHeader;