import { useTranslation } from "react-i18next";
import { z } from "zod";

export const prescriptionSchema = () => {
  const { t } = useTranslation("prescription");

  return z.object({
    diagnosis: z.string().min(1, t("prescription:required")),
    medicines: z
      .array(
        z.object({
          name: z.string().min(1, t("prescription:required")),
          dosage: z.string().min(1, t("prescription:required")),
          frequency: z.string().min(1, t("prescription:required")),
          duration: z.string().min(1, t("prescription:required")),
          instructions: z.string().optional(),
        }),
      )
      .min(1, t("prescription:atLeastOneMedicine")),
    notes: z.string().optional(),
    followUpDate: z.string().optional(),
  });
};

export type PrescriptionFormData = z.infer<
  ReturnType<typeof prescriptionSchema>
>;
