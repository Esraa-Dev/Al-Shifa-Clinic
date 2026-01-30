import { z } from "zod";

export const doctorProfileSchema = z.object({
  department: z.string().min(1, "Department is required"),
  specialization_en: z.string().min(1, "Specialization (EN) is required"),
  specialization_ar: z.string().min(1, "Specialization (AR) is required"),
  qualification_en: z.string().min(1, "Qualification (EN) is required"),
  qualification_ar: z.string().min(1, "Qualification (AR) is required"),
  experience: z.number()
    .min(0, "Experience must be at least 0 years")
    .max(50, "Experience cannot exceed 50 years"),
  fee: z.number()
    .min(0, "Fee must be at least 0"),
  description_en: z.string().max(2000).optional().or(z.literal("")),
  description_ar: z.string().max(2000).optional().or(z.literal("")),
  schedule: z.array(
    z.object({
      day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
      startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    })
  ).min(1, "At least one schedule slot is required"),
});

export type doctorProfileFormData = z.infer<typeof doctorProfileSchema>;