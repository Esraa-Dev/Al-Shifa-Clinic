import { Building2, Phone, Video } from "lucide-react";

export const BOOKING_STEPS = [
  {
    id: 1,
    label: "التاريخ والوقت",
  },
  {
    id: 2,
    label: "تفاصيل الحالة",
  },
  {
    id: 3,
    label: "تأكيد الحجز",
  }
];


export const APPOINTMENT_TYPES = [
  { id: "clinic", label: "عيادة", icon: Building2 },
  { id: "video", label: "فيديو", icon: Video },
  { id: "voice", label: "صوت", icon: Phone },
];
