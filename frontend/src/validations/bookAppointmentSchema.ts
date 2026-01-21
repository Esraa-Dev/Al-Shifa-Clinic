import { z } from "zod";

export const stepOneSchema = z.object({
  selectedDate: z.date(),
  selectedSlot: z.string().min(1, "يرجى اختيار وقت الموعد"),
}).refine(
  (data) => data.selectedDate !== null && data.selectedDate !== undefined,
  {
    message: "يرجى اختيار تاريخ الموعد",
    path: ["selectedDate"],
  }
);

export const stepTwoSchema = z.object({
  consultationType: z.enum(["clinic", "video", "voice"]),
  symptoms: z.string().min(10, "يرجى وصف الأعراض بـ 10 أحرف على الأقل"),
});