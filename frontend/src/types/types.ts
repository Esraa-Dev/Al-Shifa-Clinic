import type { LucideIcon } from "lucide-react";
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

export interface MobileNavbarProps {
  isOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

export interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  image: string;
  createdAt: string;
}

interface tabsProps {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface PatientSidebarTabsProps {
  tabs: Array<tabsProps>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface PatientAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: "spouse" | "parent" | "child" | "sibling" | "friend" | "other" | "";
  phone: string;
}

export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  dateOfBirth: string | null;
  gender: "male" | "female" | "other" | "prefer-not-to-say" | "";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown" | "";
  address: PatientAddress;
  emergencyContact?: EmergencyContact;
  medicalHistory: string;
  allergies: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface PatientPersonalInfoProps {
  userData: PatientProfile;
}

export interface PatientProfileFormProps {
  userData?: PatientProfile;
  setIsEditing: (value: boolean) => void;
}

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  doctorsCount: number;
  createdAt: string;
  updatedAt: string;
}
