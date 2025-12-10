import { useState, useEffect, useRef } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import AppForm from "./AppForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpSchema } from "../../validations/otpSchema";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";
import type { VerifyFormData } from "../../types/types";

const EmailVerificationForm = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputRefs = useRef<(null | HTMLInputElement)[]>([]);
  const { mutate, isPending: isVerifying } = useVerifyEmail();

  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpSchema),
    mode: "onChange",
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);


  const handleInputChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setValue("verifyOtp", newCode.join(""), { shouldValidate: true });
    trigger("verifyOtp");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const OtpPastedText = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(OtpPastedText)) {
      const otp = OtpPastedText.split("")
      setCode(otp);
      setValue("verifyOtp", otp.join(""), { shouldValidate: true });
      trigger("verifyOtp");
      inputRefs.current[5]?.focus();
    }
  }

const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  const newArr = [...code];
  if (e.key === "Backspace") {
    if (newArr[index]) {
      newArr[index] = "";
      setCode(newArr);
      return;
    }
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    return;
  }
  if (e.key === "ArrowLeft" && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
  if (e.key === "ArrowRight" && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

  const onSubmit = async (data: VerifyFormData) => {
    mutate(data);
  };
  return (
    <AppForm title="تأكيد البريد الإلكتروني">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-center">
          <div className="w-20 h-20 bg-linear-to-r rounded-full from-primary to-secondary flex-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <p className="text-base font-semibold text-primaryText">
            تم إرسال رمز التحقق إلى
          </p>
          <p className="text-sm text-gray-600 font-medium">
            {"esraa@gmail.com"}
          </p>
        </div>

        <div className="flex justify-center gap-3" dir="ltr">
          {code.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={digit}
              placeholder="•"
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              onChange={(e) => handleInputChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-xl 
                        border border-primaryBorder 
                        focus-visible:border-orange-500 
                        focus-visible:outline-0
                        transition"
            />
          ))}
        </div>

        {errors.verifyOtp && (
          <p className="text-red-500 text-sm text-center mt-1">
            {errors.verifyOtp.message}
          </p>
        )}
        <Button type="submit" className="w-full py-3" disabled={isVerifying}>
          {isVerifying ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري التحقق...
            </div>
          ) : (
            "تأكيد الحساب"
          )}
        </Button>

      </form>
    </AppForm>
  );
};

export default EmailVerificationForm;
