import { z } from "zod";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const scheduleSchema = z.object({
  day: z
    .enum(days)
    .refine((val) => days.includes(val), { message: "اليوم مطلوب" }),
  startTime: z.string().min(1, "وقت البدء مطلوب"),
  endTime: z.string().min(1, "وقت الانتهاء مطلوب"),
});

export const doctorOnboardingSchema = z.object({
  department: z.string().min(1, "القسم مطلوب"),
  specialization: z.string().min(1, "التخصص مطلوب"),
  qualification: z.string().min(1, "المؤهل مطلوب"),
  experience: z
    .number()
    .min(0, "الخبرة يجب أن تكون 0 أو أكثر")
    .max(50, "الخبرة لا يمكن أن تتجاوز 50 سنة")
    .int("يجب أن تكون الخبرة عدد صحيح"),
  fee: z.number().min(100, "أقل سعر للكشف 100 جنية"),
  description: z.string().optional(),
  schedule: z.array(scheduleSchema).min(1, "يجب إضافة يوم عمل واحد على الأقل"),
});
