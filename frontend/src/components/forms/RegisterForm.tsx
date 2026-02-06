import { User, Mail, Lock, Phone, Loader2, Stethoscope } from "lucide-react";
import { TextInput } from "../ui/TextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import AppForm from "./AppForm";
import { useRegister } from "../../hooks/auth/useRegister";
import {
  registerSchema,
  type RegisterFormData,
} from "../../validations/registerSchema";
import { useTranslation } from "react-i18next";

export const RegisterForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  return (
    <AppForm title={t("auth:createNewAccount")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          id="firstName"
          label={t("auth:firstName")}
          Icon={User}
          type="text"
          placeholder={t("auth:enterFirstName")}
          register={register("firstName")}
          error={errors.firstName}
          requiredInput
        />

        <TextInput
          id="lastName"
          label={t("auth:lastName")}
          Icon={User}
          type="text"
          placeholder={t("auth:enterLastName")}
          register={register("lastName")}
          error={errors.lastName}
          requiredInput
        />

        <TextInput
          id="email"
          label={t("auth:email")}
          Icon={Mail}
          type="email"
          placeholder={t("auth:enterEmail")}
          register={register("email")}
          error={errors.email}
          requiredInput
        />

        <TextInput
          id="phone"
          label={t("auth:phone")}
          Icon={Phone}
          type="text"
          placeholder={t("auth:enterPhone")}
          register={register("phone")}
          error={errors.phone}
          requiredInput
        />

        <TextInput
          id="password"
          label={t("auth:password")}
          Icon={Lock}
          type="password"
          placeholder={t("auth:enterPassword")}
          register={register("password")}
          error={errors.password}
          requiredInput
        />

        <TextInput
          id="confirmPassword"
          label={t("auth:confirmPassword")}
          Icon={Lock}
          type="password"
          placeholder={t("auth:reEnterPassword")}
          register={register("confirmPassword")}
          error={errors.confirmPassword}
          requiredInput
        />

        <div className="mb-6">
          <label className="block font-medium text-primaryText text-base! mb-4">
            {t("auth:accountType")}
          </label>
          <div className="inline-flex rounded-lg border border-primaryBorder p-1 bg-background w-full">
            <div className="relative flex-1 h-full">
              <input
                id="patient"
                type="radio"
                value="patient"
                {...register("role")}
                className="peer hidden"
                defaultChecked
              />
              <label
                htmlFor="patient"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3! text-sm! font-medium text-primaryText transition-all duration-200 peer-checked:bg-primary peer-checked:text-white! select-none leading-none mb-0!"
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="flex items-center"> {t("auth:patient")}</span>
              </label>
            </div>

            <div className="relative flex-1 h-full">
              <input
                id="doctor"
                type="radio"
                value="doctor"
                {...register("role")}
                className="peer hidden"
              />
              <label
                htmlFor="doctor"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3! text-sm! font-medium text-primaryText transition-all duration-200 peer-checked:bg-primary peer-checked:text-white! select-none leading-none mb-0!"
              >
                <Stethoscope className="w-4 h-4 shrink-0" />
                <span className="flex items-center">{t("auth:doctor")}</span>
              </label>
            </div>
          </div>
        </div>

        <Button className="w-full py-4" type="submit" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("auth:creating")}
            </div>
          ) : (
            t("auth:createAccount")
          )}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-primaryText text-sm!">
            {t("auth:haveAccount")}{" "}
            <Link
              to="/login"
              className="text-secondary hover:text-primary font-semibold"
            >
              {t("auth:login")}
            </Link>
          </p>
        </div>
      </form>
    </AppForm>
  );
};
