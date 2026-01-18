import type { TextareaProps } from "../../types/types";
import { useTranslation } from "react-i18next";

export const Textarea = ({
    label,
    placeholder,
    register,
    error,
    id,
    className = "",
    requiredInput
}: TextareaProps) => {
    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === "rtl";

    return (
        <div className={`mb-4 ${className}`} dir={isRtl ? "rtl" : "ltr"}>
            <label htmlFor={id} className="block text-base! font-medium! text-primaryText mb-4 text-start">
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
                    ${isRtl ? 'text-right' : 'text-left'}
                `}
                dir={isRtl ? "rtl" : "ltr"}
            />
            {error && error.message && (
                <p className="text-red-500 text-sm mt-1 text-start">
                    {error.message}
                </p>
            )}
        </div>
    );
};