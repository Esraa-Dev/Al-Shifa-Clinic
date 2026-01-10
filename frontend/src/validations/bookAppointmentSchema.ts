import { z } from "zod";

export const bookAppointmentFormSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  departmentId: z.string().min(1, "Department is required"),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
  fee: z.number().positive("Fee must be greater than zero"),
});

export type BookAppointmentFormData = z.infer<typeof bookAppointmentFormSchema>;
