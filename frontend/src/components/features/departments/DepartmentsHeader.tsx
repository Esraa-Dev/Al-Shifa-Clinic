import type { DepartmentsHeaderProps } from "../../../types/types";
import { DoctorSearch } from "../../ui/DoctorSearch";



const DepartmentsHeader = ({
    title,
    subtitle,
    searchPlaceholder,
    onSearchChange
}: DepartmentsHeaderProps) => {
    return (
        <>
            <div className="text-center mb-8 md:mb-12 px-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4 leading-tight">
                    {title}
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            <div className="mb-8 md:mb-10 px-2">
                <div className="max-w-3xl mx-auto">
                    <DoctorSearch
                        placeholder={searchPlaceholder}
                        onSearchChange={onSearchChange}
                    />
                </div>
            </div>
        </>
    );
};
export default DepartmentsHeader;