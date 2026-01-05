import type { TextareaProps } from "../../types/types";

export const Textarea = ({
  label,
  placeholder,
  register,
  error,
  id,
  requiredInput = false,
  rows = 4,
}: TextareaProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-primaryText mb-4"
        >
          {label}
          {requiredInput && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          id={id}
          rows={rows}
          {...register}
          placeholder={placeholder}
          className={`block w-full pl-4 pr-4 py-4 text-sm border
            ${error ? "border-red-500" : "border-primaryBorder"}
            rounded-md placeholder:primaryText
            focus:outline-none bg-background
            transition duration-200 resize-none text-right`}
        />
      </div>

      {error?.message && (
        <p className="text-red-500 text-sm mt-2 text-right">
          {error.message}
        </p>
      )}
    </div>
  );
};
