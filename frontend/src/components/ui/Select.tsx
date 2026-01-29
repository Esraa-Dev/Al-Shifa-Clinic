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
    isDashboard = false,
}: SelectProps & { isDashboard?: boolean }) => {
    const { i18n } = useTranslation();
    const isRtl = isDashboard ? false : i18n.dir() === "rtl";

    return (
        <div className={`mb-4 ${className}`} dir={isDashboard ? "ltr" : isRtl ? "rtl" : "ltr"}>
            <label
                htmlFor={id}
                className={`block text-base! font-medium text-primaryText mb-4 ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'}`}
            >
                {label}
                {requiredSelect && <span className="text-red-500 mx-1">*</span>}
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
                        ${isDashboard
                            ? 'pl-4 pr-10 text-left'
                            : isRtl
                                ? 'pr-4 pl-10 text-right'
                                : 'pl-4 pr-10 text-left'
                        }
                    `}
                    dir={isDashboard ? "ltr" : isRtl ? "rtl" : "ltr"}
                >
                    {children}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 ${isDashboard ? 'right-0' : isRtl ? 'left-0' : 'right-0'} flex items-center px-3`}>
                    <ChevronDown size={20} className="text-primaryText" />
                </div>
            </div>
            {error && error.message && (
                <p className={`text-red-500 text-sm mt-2 ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'}`}>
                    {error.message}
                </p>
            )}
        </div>
    );
};