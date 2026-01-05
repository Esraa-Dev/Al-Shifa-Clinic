import { useState, useEffect, useRef } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "../ui/Button";
import AppForm from "./AppForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetOtpSchema, type ResetOtpFormData } from "../../validations/resetOtpSchema";
import { useVerifyResetOtp } from "../../hooks/auth/useVerifyResetOtp";
import { useResendOtp } from "../../hooks/auth/useResendOtp";
import { useLocation } from "react-router-dom";
import { CountdownTimer } from "../CountdownTimer";

export const ResetOtpVerificationForm = () => {
    const [code, setCode] = useState(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { mutate: verifyResetOtp, isPending } = useVerifyResetOtp();
    const { mutate: resendOtp, isPending: isResending } = useResendOtp();
    const location = useLocation();
    const userEmail = location.state?.email;

    const {
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetOtpSchema),
        mode: "onChange",
    });

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setValue("resetPasswordOtp", newCode.join(""), { shouldValidate: true });
        trigger("resetPasswordOtp");
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pasted)) {
            const otp = pasted.split("");
            setCode(otp);
            setValue("resetPasswordOtp", otp.join(""), { shouldValidate: true });
            trigger("resetPasswordOtp");
            inputRefs.current[5]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        const newArr = [...code];

        if (e.key === "Backspace") {
            if (newArr[index]) {
                newArr[index] = "";
                setCode(newArr);
                return;
            }
            if (index > 0) inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const onSubmit = (data: ResetOtpFormData) => {
        verifyResetOtp({ ...data, email: userEmail });
    };

    const handleResendOtp = () => {
        if (userEmail) {
            resendOtp({
                email: userEmail,
                type: "reset"
            });
        }
    };

    return (
        <AppForm title="تأكيد رمز إعادة تعيين كلمة المرور">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center">
                    <div className="w-20 h-20 bg-linear-to-r rounded-full from-primary to-secondary flex-center justify-center mx-auto mb-4">
                        <Mail className="w-10 h-10 text-white" />
                    </div>

                    <p className="text-base font-semibold text-primaryText">
                        تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني
                    </p>
                    {userEmail && (
                        <p className="text-sm text-gray-600 font-medium mt-2">
                            {userEmail}
                        </p>
                    )}
                </div>

                <div className="flex justify-center gap-3" dir="ltr">
                    {code.map((digit, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            value={digit}
                            placeholder="•"
                            ref={(el) => { inputRefs.current[i] = el; }}
                            onChange={(e) => handleInputChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={i === 0 ? handlePaste : undefined}
                            className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-xl 
                     border border-primaryBorder 
                     focus-visible:border-orange-500 
                     focus-visible:outline-0 transition"
                        />
                    ))}
                </div>

                {errors.resetPasswordOtp && (
                    <p className="text-red-500 text-sm text-center mt-1">
                        {errors.resetPasswordOtp.message}
                    </p>
                )}

                <Button type="submit" className="w-full py-3" disabled={isPending}>
                    {isPending ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin ml-2" />
                            جاري التحقق...
                        </div>
                    ) : (
                        "تأكيد الرمز"
                    )}
                </Button>

                <div className="flex justify-center">
                    {isResending ? (
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            جاري الإرسال...
                        </div>
                    ) : (
                        <CountdownTimer
                            storageKey="otp_expiry_reset"
                            userEmail={userEmail}
                            onResend={handleResendOtp}
                            resendText="إعادة إرسال الرمز"
                            timerText="إعادة الإرسال بعد"
                        />

                    )}
                </div>
            </form>
        </AppForm>
    );
};