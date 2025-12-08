import * as yup from "yup";
 export const registerSchema = yup.object({
  name: yup
    .string()
    .min(3, "الاسم يجب أن يكون على الأقل 3 أحرف")
    .required("الاسم مطلوب"),
  email: yup
    .string()
    .email("البريد الإلكتروني غير صالح")
    .required("البريد الإلكتروني مطلوب"),
  phone: yup
    .string()
    .matches(/^[0-9+]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط و +")
    .min(10, "رقم الهاتف يجب أن يكون على الأقل 10 أرقام")
    .max(15, "رقم الهاتف يجب ألا يتجاوز 15 رقم")
    .required("رقم الهاتف مطلوب"),
  password: yup
    .string()
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
    .required("كلمة المرور مطلوبة"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "كلمات المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
});
