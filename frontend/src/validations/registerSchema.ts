import { z } from "zod";
const UserRole = z.enum(["patient", "doctor"]);

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "الاسم الأول مطلوب")
      .min(3, "الاسم يجب أن يكون على الأقل 3 أحرف"),
    lastName: z
      .string()
      .min(1, "الاسم الأخير مطلوب")
      .min(3, "الاسم يجب أن يكون على الأقل 3 أحرف"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صالح"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(/^[0-9+]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط و +")
      .min(10, "رقم الهاتف يجب أن يكون على الأقل 10 أرقام")
      .max(15, "رقم الهاتف يجب ألا يتجاوز 15 رقم"),
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    role: UserRole,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
