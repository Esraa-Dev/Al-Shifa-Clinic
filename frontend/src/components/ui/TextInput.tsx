import { useState } from "react"
import type { TextInputProps } from "../../types/types"
import { Eye, EyeOff } from "lucide-react"
export const TextInput = ({ label, Icon, type = "text", placeholder, register, error }: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="mb-4">
      <label className="block font-medium text-primaryText mb-4">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Icon className="text-primaryText" size={20} />
          </div>
        )}
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          {...register}
          placeholder={placeholder}
          className="block w-full pl-4 pr-10 py-4 text-sm border border-primaryBorder rounded-md placeholder:primaryText focus:outline-none bg-background transition duration-200"
          required
          autoFocus
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && error.message && (
        <p className="text-red-500 text-sm mt-2 text-right">
          {error.message}
        </p>
      )}
    </div>
  )
}

