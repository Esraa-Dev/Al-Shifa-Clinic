import { z } from "zod";
import i18n from "../i18n";

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: i18n.t("validation:required") })
    .min(2, { message: i18n.t("validation:name") }),
  email: z
    .string()
    .min(1, { message: i18n.t("validation:required") })
    .email({ message: i18n.t("validation:email") }),
  phone: z
    .string()
    .min(1, { message: i18n.t("validation:required") })
    .min(10, { message: i18n.t("validation:phone") }),
  subject: z
    .string()
    .min(1, { message: i18n.t("validation:required") })
    .min(3, { message: i18n.t("validation:subject") }),
  message: z
    .string()
    .min(1, { message: i18n.t("validation:required") })
    .min(10, { message: i18n.t("validation:message") }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
