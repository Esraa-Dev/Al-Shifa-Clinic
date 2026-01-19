import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DoctorSearchProps {
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export const DoctorSearch = ({ onSearchChange, placeholder }: DoctorSearchProps) => {
    const { t, i18n } = useTranslation();
    const [searchInputValue, setSearchInputValue] = useState("");
    const isRtl = i18n.dir() === "rtl";

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange(searchInputValue);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchInputValue, onSearchChange]);

    return (
        <div className="relative flex-1 w-full group">
            <div className={`absolute inset-y-0 ${isRtl ? 'right-0' : 'left-0'} flex items-center px-4 pointer-events-none transition-all duration-300`}>
                <div className="p-2 bg-primary rounded-full group-focus-within:bg-primary/70 transition-all duration-300">
                    <Search
                        className="text-white transition-colors duration-300"
                        size={22}
                    />
                </div>
            </div>

            <input
                type="text"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                placeholder={placeholder || t('doctorList:search')}
                dir={isRtl ? "rtl" : "ltr"}
                className={`
                    w-full py-4 text-sm md:text-base
                    rounded-lg border border-primary
                    bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]
                    placeholder:text-gray-400
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80 focus:bg-white
                    ${isRtl ? "pr-16 pl-6 text-right" : "pl-16 pr-6 text-left"}
                `}
            />

            {searchInputValue && (
                <button
                    onClick={() => setSearchInputValue("")}
                    className={`absolute inset-y-0 ${isRtl ? 'left-4' : 'right-4'} flex items-center text-gray-400 hover:text-primary transition-colors`}
                    aria-label={t("common:clearSearch") || "Clear search"}
                >
                    <span className="text-xl"><X /></span>
                </button>
            )}
        </div>
    );
};