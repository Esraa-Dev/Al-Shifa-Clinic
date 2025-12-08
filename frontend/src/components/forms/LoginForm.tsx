import { Mail, Lock, Loader2 } from "lucide-react";
import { TextInput } from "../ui/TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import AppForm from "./AppForm";
import { useLogin } from "../../hooks/useLogin";
import { loginSchema } from "../../validations/loginSchema"
import type { LoginFormData } from "../../types/types";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { mutate, isPending } = useLogin();
  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <AppForm title="تسجيل الدخول">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="البريد الإلكتروني"
          Icon={Mail}
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          register={register("email")}
          error={errors.email}
        />

        <TextInput
          label="كلمة المرور"
          Icon={Lock}
          type="password"
          placeholder="أدخل كلمة المرور"
          register={register("password")}
          error={errors.password}
        />

        <Button className="w-full py-4" type="submit" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              جاري التسجيل
            </div>
          ) : (
            "تسجيل الدخول"
          )}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-primaryText text-sm">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-secondary hover:text-primary font-semibold"
            >
              سجّل الآن
            </Link>
          </p>
        </div>
      </form>
    </AppForm>
  );
};

export default LoginForm;