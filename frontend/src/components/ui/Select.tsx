import { ChevronDown } from "lucide-react";
import type { SelectProps } from "../../types/types";
import { useTranslation } from "react-i18next";

export const Select = ({
    label,
    register,
    error,
    children,
    id,
    requiredSelect = false,
    disabled = false,
    className = "",
}: SelectProps) => {
    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === "rtl";

    return (
        <div className={`mb-4 ${className}`} dir={isRtl ? "rtl" : "ltr"}>
            <label htmlFor={id} className="block text-base! font-medium! text-primaryText mb-4 text-start">
                {label}
                {requiredSelect && <span className="text-red-500 mr-1">*</span>}
            </label>
            <div className="relative">
                <select
                    id={id}
                    {...register}
                    disabled={disabled}
                    className={`
            block w-full py-4 px-4 text-sm border rounded-md
            bg-background focus:outline-none transition duration-200
            appearance-none cursor-pointer
            ${error
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-primaryBorder focus:ring-2 focus:ring-primary/20 focus:border-primary'
                        }
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}
            ${isRtl ? 'pr-4 pl-10' : 'pl-4 pr-10'}
            rtl:text-right
            ltr:text-left
          `}
                    dir={isRtl ? "rtl" : "ltr"}
                >
                    {children}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 ${isRtl ? 'left-0' : 'right-0'} flex items-center px-3`}>
                    <ChevronDown size={20} className="text-primaryText" />
                </div>
            </div>
            {error && error.message && (
                <p className="text-red-500 text-sm mt-2 text-start">
                    {error.message}
                </p>
            )}
        </div>
    );
};