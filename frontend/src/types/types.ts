import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

export interface TextInputProps {
  label: string;
  Icon?: React.ComponentType<{ className?: string; size?: number }>;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}
export interface AppFormProps {
  title?: string;
  children: React.ReactNode;
}
export interface ProtectedRouteProps {
  allowedRoles?: string[];
}
