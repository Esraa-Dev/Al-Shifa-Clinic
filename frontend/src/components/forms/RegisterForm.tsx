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

export const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const { mutate, isPending } = useRegister();
    const onSubmit = (data: RegisterFormData) => {
        mutate(data);
    };

    return (
        <AppForm title="إنشاء حساب جديد">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextInput
                    id="firstName"
                    label="الاسم الأول"
                    Icon={User}
                    type="text"
                    placeholder="أدخل الاسم الأول"
                    register={register("firstName")}
                    error={errors.firstName}
                    requiredInput
                />
                <TextInput
                    id="lastName"
                    label=" الاسم الأخير"
                    Icon={User}
                    type="text"
                    placeholder="أدخل الاسم الأخير"
                    register={register("lastName")}
                    error={errors.lastName}
                    requiredInput
                />
                <TextInput
                    id="email"
                    label="البريد الإلكتروني"
                    Icon={Mail}
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    register={register("email")}
                    error={errors.email}
                    requiredInput
                />
                <TextInput
                    id="phone"
                    label="رقم الهاتف"
                    Icon={Phone}
                    type="text"
                    placeholder="أدخل رقم الهاتف"
                    register={register("phone")}
                    error={errors.phone}
                    requiredInput
                />

                <TextInput
                    id="password"
                    label="كلمة المرور"
                    Icon={Lock}
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    register={register("password")}
                    error={errors.password}
                    requiredInput
                />
                <TextInput
                    id="confirmPassword"
                    label="تأكيد كلمة المرور"
                    Icon={Lock}
                    type="password"
                    placeholder="أعد إدخال كلمة المرور"
                    register={register("confirmPassword")}
                    error={errors.confirmPassword}
                    requiredInput
                />
                <div className="mb-6">
                    <label className="block font-medium text-primaryText mb-4">
                        نوع الحساب
                    </label>

                    <div className="inline-flex rounded-lg border border-primaryBorder p-1 bg-background">
                        <div className="relative">
                            <input
                                id="patient"
                                type="radio"
                                value="patient"
                                {...register("role")}
                                className="hidden peer"
                                defaultChecked
                            />
                            <label
                                htmlFor="patient"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 peer-checked:bg-primary peer-checked:text-white text-primaryText"
                            >
                                <User className="w-4 h-4 ml-2" />
                                مريض
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                id="doctor"
                                type="radio"
                                value="doctor"
                                {...register("role")}
                                className="hidden peer"
                            />
                            <label
                                htmlFor="doctor"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 peer-checked:bg-primary peer-checked:text-white text-primaryText"
                            >
                                <Stethoscope className="w-4 h-4 ml-2" />
                                طبيب
                            </label>
                        </div>
                    </div>
                </div>
                <Button className="w-full py-4" type="submit" disabled={isPending}>
                    {isPending ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin ml-2" />
                            جاري الإنشاء
                        </div>
                    ) : (
                        "إنشاء الحساب"
                    )}
                </Button>

                <div className="mt-6 text-center">
                    <p className="text-primaryText text-sm">
                        لديك حساب بالفعل؟{" "}
                        <Link
                            to="/login"
                            className="text-secondary hover:text-primary font-semibold"
                        >
                            سجل الدخول
                        </Link>
                    </p>
                </div>
            </form>
        </AppForm>
    );
};