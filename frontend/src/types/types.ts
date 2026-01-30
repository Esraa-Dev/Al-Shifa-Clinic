import type { LucideIcon } from "lucide-react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

export interface TextInputProps {
  label: string;
  Icon?: React.ComponentType<{ className?: string; size?: number }>;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  id?: string;
  requiredInput?: boolean;
  isDashboard?: boolean;
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
  setIsMenuOpen: (isOpen: boolean) => void;
  user: any;
  isLoading: boolean;
  onLogout: () => void;
}

export interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  image?: string;
  createdAt: string;
  title?: string;
  isUpdating: boolean;
  onImageUpload: (formData: FormData) => void;
  isDoctor?: boolean;
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
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  dateOfBirth: string | null;
  gender: string;
  bloodGroup: string;
  address: PatientAddress;
  emergencyContact?: EmergencyContact;
  medicalHistory: string;
  allergies: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  profileStatus?: string;
  role?: string;
  isEmailVerified?: boolean;
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
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  icon?: string;
  isActive: boolean;
  doctorsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  doctorCount?: number;
}

export interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  image?: string;
  phone: string;
  role: "doctor" | "patient" | "admin";
  isEmailVerified: boolean;
  verifyOtp?: string;
  verifyOtpExpireAt?: string | Date;
  resetPasswordOtp?: string;
  resetPasswordOtpExpireAt?: string | Date;
  refreshToken?: string;
  isActive: boolean;
  profileStatus?: "incomplete" | "completed";
  department?: string | Department;
  specialization_en?: string;
  specialization_ar?: string;
  qualification_en?: string;
  qualification_ar?: string;
  experience?: number;
  fee?: number;
  description_en?: string;
  description_ar?: string;
  schedule?: Array<{
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    startTime: string;
    endTime: string;
  }>;
  rating?: number;
  totalReviews?: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
// In your types.ts file, remove or update the DoctorProfileFormData interface
// Keep only one consistent definition
export type DoctorProfileFormData = {
  department: string;
  specialization_en: string;
  specialization_ar: string;
  qualification_en: string;
  qualification_ar: string;
  experience: number;
  fee: number;
  description_en?: string;
  description_ar?: string;
  schedule: Array<{
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    startTime: string;
    endTime: string;
  }>;
};

export interface BookedSlotsParams {
  doctorId: string;
  date: string;
}

export interface BookAppointmentParams {
  doctorId: string;
  data: {
    appointmentDate: string;
    startTime: string;
    endTime: string;
    type: "clinic" | "video" | "voice";
    fee: number;
    symptoms_en?: string;
    symptoms_ar?: string;
  };
}

export interface UserBasicInfo {
  _id: string;
  firstName: string;
  lastName: string;
  image?: string;
  phone?: string;
  email?: string;
}

export interface DoctorBasicInfo extends UserBasicInfo {
  specialization_en: string;
  specialization_ar: string;
  fee: number;
}

export interface Appointment {
  _id: string;
  patientId: string | UserBasicInfo;
  doctorId: string | DoctorBasicInfo;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: "clinic" | "video" | "voice";
  status: "Pending" | "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  fee: number;
  symptoms?: string;
  roomId?: string;
  callStatus?: "idle" | "ringing" | "connected" | "ended";
  callStartedAt?: Date;
  callEndedAt?: Date;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  stripePaymentId?: string;
  stripeClientSecret?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
export interface TextareaProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
  label?: string;
  placeholder?: string;
  id?: string;
  requiredInput?: boolean;
  rows?: number;
  className?: string;
  isDashboard?: boolean;
}

export interface DoctorFilters {
  search: string;
  department: string | null;
  fee: number | null;
  experience: number | null;
  schedule: string | null;
  sortBy: string;
  page?: number;
  limit?: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DoctorOnboardingData {
  department: string;
  specialization_en: string;
  specialization_ar: string;
  qualification_en: string;
  qualification_ar: string;
  experience: number;
  fee: number;
  description_en?: string;
  description_ar?: string;
  schedule: {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    startTime: string;
    endTime: string;
  }[];
}

export interface SelectProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  children: React.ReactNode;
  id?: string;
  requiredSelect?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  isOnline?: boolean;
  variant: "doctor" | "patient";
  onActionComplete?: () => void;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  image?: string;
  isEmailVerified: boolean;
  profileStatus?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: "patient" | "doctor";
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpFormData {
  email?: string;
  verifyOtp: string;
}

export interface ResetOtpFormData {
  email: string;
  resetPasswordOtp: string;
}

export interface PatientProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: "spouse" | "parent" | "child" | "sibling" | "friend" | "other";
  };
  medicalHistory?: string;
  allergies?: string[];
}

export interface ContactMethod {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  details: string;
  descKey: string;
}

export interface ContactInfoItem {
  icon: LucideIcon;
  textKey: string;
  details?: string;
  detailsKey?: string;
}

export interface NavLink {
  href: string;
  labelKey: string;
  translationKey: string;
}

export interface EmptyStateProps {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey?: string;
  actionLabelKey?: string;
  onAction?: () => void;
}

export interface DoctorListHeaderProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  toggleFiltersLabel: string;
}

export interface DoctorListFiltersProps {
  isDepartmentLoading: boolean;
  departmentData: any;
  selectedDepartment: string | null;
  setSelectedDepartment: (id: string | null) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  filters: DoctorFilters;
  onExperienceChange: (value: string) => void;
  onFeeChange: (value: string) => void;
  onScheduleChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

export interface DoctorListResultsProps {
  isLoading: boolean;
  doctors: Doctor[];
  totalDoctors: number;
  onClearFilters: () => void;
}

export interface DepartmentsResultsProps {
  isLoading: boolean;
  departments: Department[];
}

export interface DepartmentsHeaderProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
}

export interface PersonalInfoStepProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  bookedSlots: string[];
  isLoadingSlots: boolean;
  generateSlots: () => string[];
  onNext: () => void;
  onBack: () => void;
}

export interface AppointmentInfoStepProps {
  consultationType: "clinic" | "video" | "voice";
  setConsultationType: (type: "clinic" | "video" | "voice") => void;
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface PaymentFormProps {
  clientSecret: string;
  appointmentId: string;
}

export interface ReviewStepProps {
  selectedDate: Date | null;
  selectedSlot: string;
  consultationType: "clinic" | "video" | "voice";
  doctorFee: number;
  symptoms: string;
  isBooking: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export interface AppointmentsParams {
  status?: string | string[];
  date?: string;
  page?: number;
  limit?: number;
}
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export interface DashboardTableColumn {
  header: string;
  key: string;
}

export interface DashboardTableProps<T = any> {
  columns: DashboardTableColumn[];
  data: T[];
  title?: string;
}

export interface RecentAppointment {
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  mode: "video" | "clinic" | "voice";
  status: string;
  consultationFees: number;
}

export interface RecentAppointmentsProps {
  appointments: RecentAppointment[];
}

export interface DeptStat {
  name: string;
  count: number;
}

interface DoctorScheduleData {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  specialization_en: string;
  isAvailableToday: boolean;
}

interface DoctorsStatusData {
  available: number;
  unavailable: number;
  list: DoctorScheduleData[];
}

export interface DoctorsStatusCardProps {
  doctorsData: DoctorsStatusData;
}

export interface TopPatientsCardProps {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  count: number;
}

export interface StatusStat {
  _id: string;
  count: number;
}

export interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
}

export interface DoctorProfileFormProps {
  userData: Doctor;
  setIsEditing: (editing: boolean) => void;
}

export type DayType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface ScheduleSlot {
  day: DayType;
  startTime: string;
  endTime: string;
}