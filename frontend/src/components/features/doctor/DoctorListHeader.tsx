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
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>

            <div className="mb-8 flex flex-col md:flex-row items-stretch gap-4 mt-6">
                <div className="flex-1">
                    <DoctorSearch
                        placeholder={searchPlaceholder}
                        onSearchChange={onSearchChange}
                    />
                </div>

                <Button
                    type="button"
                    className="px-6 flex items-center justify-center gap-2 w-full md:w-fit rounded-2xl border border-primary bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
                    onClick={onToggleFilters}
                >
                    <Filter size={20} />
                    <span className="font-medium text-base">{toggleFiltersLabel}</span>
                </Button>
            </div>
        </div>
    );
};

export default DoctorListHeader;