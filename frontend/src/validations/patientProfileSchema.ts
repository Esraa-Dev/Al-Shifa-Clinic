import { z } from "zod";
import i18n from "../i18n";

export const patientProfileSchema = z.object({
  firstName: z.string().min(3, i18n.t("validation:firstNameRequired")),
  lastName: z.string().min(3, i18n.t("validation:lastNameRequired")),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, i18n.t("validation:invalidPhone")),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"])
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      pincode: z.string().optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  medicalHistory: z.string().optional(),
  allergies: z.union([z.string(), z.array(z.string())]).optional(),
});

export type PatientProfileFormData = z.infer<typeof patientProfileSchema>;
