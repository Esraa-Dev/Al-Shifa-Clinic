import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  password: yup.string().required("كلمة المرور مطلوبة"),
});
