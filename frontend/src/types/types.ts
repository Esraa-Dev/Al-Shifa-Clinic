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
  relationship:
    | "spouse"
    | "parent"
    | "child"
    | "sibling"
    | "friend"
    | "other"
    | "";
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
  bloodGroup:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-"
    | "Unknown"
    | "";
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
  isActive: boolean;
  languageSpoken?: string[];
  bloodGroup?: string;
  featuredOnWebsite?: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
  rating: number;
  totalReviews: number;
  dateOfBirth?: string | Date;
  yearOfExperience?: number;
  specialization?: string;
  qualification?: string;
  experience: number;
  fee: number;
  department?: {
    _id: string;
    name: string;
  };
  designation?: string;
  bio?: string;
  aboutDoctor?: string;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  session?: {
    from?: string;
    to?: string;
  };
  appointmentSettings?: {
    appointmentType?: string;
    acceptBookingsInAdvance?: number;
    appointmentDuration?: number;
    consultationCharge?: number;
    maxBookingsPerSlot?: number;
    displayOnBookingPage?: boolean;
  };
  schedule?: {
    day?: string;
    from?: string;
    to?: string;
    isAvailable?: boolean;
  }[];
  education?: {
    degree?: string;
    university?: string;
    from?: number;
    to?: number;
  }[];
  awards?: {
    name?: string;
    from?: number;
  }[];
  certifications?: {
    name?: string;
    from?: number;
  }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

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
    symptoms?: string;
  };
}

export interface Appointment {
  _id: string;
  id?: string;
  patientId: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    image?: string;
    dateOfBirth?: string | Date;
    gender?: string;
  };
  doctorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    image?: string;
    specialization: string;
    fee: number;
    clinicAddress?: string;
  };
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: "clinic" | "video" | "voice";
  status: "Scheduled" | "Completed" | "Cancelled" | "In Progress";
  fee: number;
  paymentStatus: "pending" | "paid" | "refunded";
  symptoms?: string;
  roomId?: string;
  callStatus?: "idle" | "ringing" | "ongoing" | "ended" | "missed";
  callStartedAt?: Date;
  callEndedAt?: Date;
  callDuration?: number;
  chatEnabled?: boolean;
  lastMessageAt?: Date;
  unreadCount?: {
    patient: number;
    doctor: number;
  };
  metadata?: {
    recordingUrl?: string;
    callQuality?: number;
    notes?: string;
  };
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
}

export interface DoctorFilters {
  search: string;
  department: string | null;
  fee: number | null;
  experience: number | null;
  schedule: string | null;
  sortBy: string;
}

export interface DoctorOnboardingData {
  department: string;
  specialization: string;
  qualification: string;
  experience: number;
  fee: number;
  description?: string;
  schedule: {
    day:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
    startTime: string;
    endTime: string;
  }[];
}

export interface Notification {
  id: string;
  type: "call" | "message" | "appointment" | "system";
  title: string;
  message: string;
  appointmentId?: string;
  userId?: string;
  read: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface CallData {
  roomId: string;
  appointmentId: string;
  callerId: string;
  callerName: string;
  callerImage?: string;
  type: "video" | "voice";
}

export interface Message {
  _id: string;
  appointmentId: string;
  senderId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        image?: string;
        role: string;
      };
  receiverId: string;
  content: string;
  messageType: "text" | "image" | "file" | "audio";
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoCallData {
  roomId: string;
  userType: "doctor" | "patient";
  userName: string;
  appointmentId?: string;
}
