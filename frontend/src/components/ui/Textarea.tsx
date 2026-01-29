import type { TextareaProps } from "../../types/types";
import { useTranslation } from "react-i18next";

export const Textarea = ({
    label,
    placeholder,
    register,
    error,
    id,
    className = "",
    isDashboard = false,
    requiredInput
}: TextareaProps) => {
    const { i18n } = useTranslation();
    const isRtl = isDashboard ? false : i18n.dir() === "rtl";

    return (
        <div className={`mb-4 ${className}`} dir={isDashboard ? "ltr" : isRtl ? "rtl" : "ltr"}>
            <label
                htmlFor={id}
                className={`block font-medium text-primaryText mb-4 ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'} text-base!`}
            >
                {label}
                {requiredInput && <span className="text-red-500 mx-1">*</span>}
            </label>
            <textarea
                id={id}
                {...register}
                placeholder={placeholder}
                rows={4}
                className={`
                    block w-full p-3 text-sm border rounded-md
                    bg-background focus:outline-none transition duration-200
                    ${error
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-primaryBorder focus:ring-primary/20 focus:border-primary'
                    }
                    ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'}
                `}
                dir={isDashboard ? "ltr" : isRtl ? "rtl" : "ltr"}
            />
            {error && error.message && (
                <p className={`text-red-500 text-sm mt-1 ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'}`}>
                    {error.message}
                </p>
            )}
        </div>
    );
};