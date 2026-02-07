import { useState } from "react";
import type { TextInputProps } from "../../types/types";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TextInput = ({
  label,
  Icon,
  type = "text",
  placeholder,
  register,
  error,
  id,
  requiredInput = false,
  isDashboard = false,
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { i18n } = useTranslation();
  const isRtl = isDashboard ? false : i18n.dir() === "rtl";

  return (
    <div className="mb-4" dir={isDashboard ? "ltr" : isRtl ? "rtl" : "ltr"}>
      <label
        htmlFor={id}
        className={`block text-base! font-medium text-primaryText mb-4 ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'}`}
      >
        {label}
        {requiredInput && <span className="text-red-500 mx-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className={`absolute inset-y-0 ${isDashboard ? 'left-3' : isRtl ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
            <Icon className="text-primaryText" size={20} />
          </div>
        )}
        <input
          id={id}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          {...register}
          placeholder={placeholder}
          className={`block w-full py-4 text-sm border 
            ${error ? "border-red-500" : "border-primaryBorder"} 
            rounded-md focus:outline-none bg-background transition duration-200
            ${isDashboard
              ? (Icon ? "pl-10 pr-4" : "px-4")
              : isRtl
                ? (Icon ? "pr-10 pl-4" : "px-4")
                : (Icon ? "pl-10 pr-4" : "px-4")
            }
            ${type === "password" ? (isDashboard ? "pr-10" : isRtl ? "pl-10" : "pr-10") : ""}
            ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'}
          `}
          dir={isDashboard ? "ltr" : isRtl ? "rtl" : "ltr"}
          autoComplete={type === "password" ? (id === "password" ? "current-password" : "new-password") : "on"}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 ${isDashboard ? 'right-3' : isRtl ? 'left-3' : 'right-3'} flex items-center cursor-pointer`}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error?.message && (
        <p className={`text-red-500 text-sm mt-2 ${isDashboard ? 'text-left' : isRtl ? 'text-right' : 'text-left'}`}>
          {error.message}
        </p>
      )}
    </div>
  );
};