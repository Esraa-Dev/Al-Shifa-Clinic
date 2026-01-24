import {
  Building2,
  Phone,
  Video,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Send,
  User,
  Calendar,
  GraduationCap,
} from "lucide-react";
import type { ContactInfoItem, ContactMethod } from "../types/types";

export const STEPS = [
  { number: 1, title: "book:steps.personalInfo", icon: User },
  { number: 2, title: "book:steps.professionalInfo", icon: Calendar },
  { number: 3, title: "book:steps.appointments", icon: Clock },
];

export const ONBOARDING_STEPS = [
  {
    number: 1,
    title: "personalInfoStep",
    icon: User,
  },
  {
    number: 2,
    title: "professionalInfoStep",
    icon: GraduationCap,
  },
  {
    number: 3,
    title: "appointmentsStep",
    icon: Calendar,
  },
];
export const APPOINTMENT_TYPES = [
  { id: "clinic", labelKey: "appointmentTypes.clinic", icon: Building2 },
  { id: "video", labelKey: "appointmentTypes.video", icon: Video },
  { id: "voice", labelKey: "appointmentTypes.voice", icon: Phone },
];

export const APPOINTMENTS_TABS = [
  { id: "upcoming", labelKey: "appointments.upcoming", label: "Upcoming" },
  { id: "completed", labelKey: "appointments.completed", label: "Completed" },
  { id: "cancelled", labelKey: "appointments.cancelled", label: "Cancelled" },
] as const;

export const CONTACT_METHODS_DATA: ContactMethod[] = [
  {
    id: "phone",
    icon: Phone,
    titleKey: "contact.phone",
    details: "+201076645457",
    descKey: "contact.available247",
  },
  {
    id: "email",
    icon: Mail,
    titleKey: "contact.email",
    details: "alshifaclinic@gmail.com",
    descKey: "contact.responseTime",
  },
  {
    id: "address",
    icon: MapPin,
    titleKey: "contact.address",
    details: "Nasr City, Makram Ebeid Street, Doctors Tower, 3rd Floor",
    descKey: "contact.workingDays",
  },
  {
    id: "hours",
    icon: Clock,
    titleKey: "contact.workingHours",
    details: "9 AM - 5 PM",
    descKey: "contact.workingDays",
  },
];

export const FAQ_KEYS = [
  { q: "contact.faq1.question", a: "contact.faq1.answer" },
  { q: "contact.faq2.question", a: "contact.faq2.answer" },
  { q: "contact.faq3.question", a: "contact.faq3.answer" },
];

export interface NavLink {
  href: string;
  labelKey: string;
  translationKey: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", labelKey: "nav.home", translationKey: "home" },
  { href: "/doctor-list", labelKey: "nav.doctors", translationKey: "doctors" },
  {
    href: "/departments",
    labelKey: "nav.departments",
    translationKey: "departments",
  },
  { href: "/about", labelKey: "nav.about", translationKey: "about" },
  { href: "/contact", labelKey: "nav.contact", translationKey: "contact" },
];

export const CONTACT_INFO: ContactInfoItem[] = [
  {
    icon: MapPin,
    textKey: "contact.address",
    detailsKey: "contact.addressDetail",
  },
  {
    icon: Phone,
    textKey: "contact.phone",
    details: "01076645457",
  },
  {
    icon: Mail,
    textKey: "contact.email",
    details: "alshifaclinic@gmail.com",
  },
];

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "العربية", nativeName: "Arabic" },
];

export const SOCIAL_LINKS = [
  {
    icon: Facebook,
    url: "#",
    name: "facebook",
  },
  {
    icon: Instagram,
    url: "#",
    name: "instagram",
  },
  {
    icon: Send,
    url: "#",
    name: "telegram",
  },
];

export const DAYS = [
  { value: "monday", label: "الاثنين" },
  { value: "tuesday", label: "الثلاثاء" },
  { value: "wednesday", label: "الأربعاء" },
  { value: "thursday", label: "الخميس" },
  { value: "friday", label: "الجمعة" },
  { value: "saturday", label: "السبت" },
  { value: "sunday", label: "الأحد" },
] as const;
