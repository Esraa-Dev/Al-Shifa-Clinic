import type { TextareaProps } from "../../types/types";

export const Textarea = ({
  register,
  error,
  label,
  requiredInput = false,
  className = "",
}: TextareaProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 rtl:text-right">
          {label}
          {requiredInput && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          {...register}
          className={`block w-full pl-4 py-4 text-sm border pr-4 ${error ? "border-red-500" : "border-primaryBorder"} rounded-md placeholder:primaryText focus:outline-none bg-background transition duration-200 flex justify-end`}

        />
      </div>
      {error && error.message && (
        <p className="text-red-500 text-sm mt-2 text-right">{error.message}</p>
      )}
    </div>
  );
};