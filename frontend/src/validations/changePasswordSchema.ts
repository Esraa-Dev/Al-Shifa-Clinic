import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;