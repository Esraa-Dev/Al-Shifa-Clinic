import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { doctorOnboardingSchema } from "../../validations/doctorOnboardingSchema";
import { Button } from "../ui/Button";
import { TextInput } from "../ui/TextInput";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { DAYS, ONBOARDING_STEPS } from "../../constants/constants";
import { useGetDepartment } from "../../hooks/department/useGetDepartment";
import type { DoctorOnboardingData } from "../../types/types";
import { useUpdateDoctorProfile } from "../../hooks/doctor/useUpdateDoctorProfile";

export const DoctorOnboardingForm = () => {
  const { t, i18n } = useTranslation(['onboarding', 'validation']);
  const isRtl = i18n.dir() === "rtl";
  const { data: departmentsData } = useGetDepartment();
  const { mutate, isPending } = useUpdateDoctorProfile();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    watch,
  } = useForm<DoctorOnboardingData>({
    resolver: zodResolver(doctorOnboardingSchema),
    defaultValues: {
      experience: 0,
      fee: 100,
      schedule: [{ day: "saturday", startTime: "09:00", endTime: "17:00" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const schedule = watch("schedule");

  const availableDays = DAYS.filter(day =>
    !schedule.some(item => item.day === day.value)
  );

  const handleAppend = () => {
    if (availableDays.length > 0) {
      append({
        day: availableDays[0].value,
        startTime: "09:00",
        endTime: "17:00"
      });
    }
  };

  const getFieldsToValidate = () => {
    if (currentStep === 1) return ["specialization_en", "specialization_ar", "qualification_en", "qualification_ar"];
    if (currentStep === 2) return ["department", "experience"];
    return ["fee", "schedule"];
  };

  const handleNext = async () => {
    const fields = getFieldsToValidate();
    const isValid = await trigger(fields as any);

    if (isValid) {
      if (currentStep === ONBOARDING_STEPS.length) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => setCurrentStep(currentStep - 1);

  const onSubmit = (data: DoctorOnboardingData) => {
    mutate(data);
  };

  const getDayLabel = (dayValue: string) => {
    const dayMap: Record<string, string> = {
      "monday": t('onboarding:monday'),
      "tuesday": t('onboarding:tuesday'),
      "wednesday": t('onboarding:wednesday'),
      "thursday": t('onboarding:thursday'),
      "friday": t('onboarding:friday'),
      "saturday": t('onboarding:saturday'),
      "sunday": t('onboarding:sunday')
    };
    return dayMap[dayValue] || dayValue;
  };

  return (
    <div className="bg-background py-8">
      <div className="max-w-4xl mx-auto container">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('onboarding:welcome')}
          </h1>
          <p className="text-gray-600 text-md">
            {t('onboarding:subtitle')}
          </p>
        </div>

        <div className="mb-14 flex items-center justify-between px-10 md:px-10 relative">
          {ONBOARDING_STEPS.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center flex-1 last:flex-none">

              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${currentStep >= stepItem.number ? "bg-primary border-primary text-white" : "bg-white border-gray-300 text-gray-400"
                  }`}>
                  <stepItem.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className={`absolute -bottom-7 text-sm font-medium w-max ${currentStep >= stepItem.number ? "text-primary" : "text-gray-500"
                  }`}>
                  {t(`onboarding:${stepItem.title}`)}
                </span>
              </div>

              {index < ONBOARDING_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 md:h-1 bg-gray-200 mx-1 md:mx-2 relative overflow-hidden">
                  <div
                    className={`absolute top-0 bottom-0 bg-primary transition-all duration-500 ${isRtl ? "right-0" : "left-0"}`}
                    style={{ width: currentStep > stepItem.number ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="specialization_en"
                label={t('onboarding:specialization_en')}
                placeholder={t('onboarding:enterSpecialization')}
                register={register("specialization_en")}
                error={errors.specialization_en}
              />
              <TextInput
                id="specialization_ar"
                label={t('onboarding:specialization_ar')}
                placeholder={t('onboarding:enterSpecializationAr')}
                register={register("specialization_ar")}
                error={errors.specialization_ar}
              />
              <TextInput
                id="qualification_en"
                label={t('onboarding:qualification_en')}
                placeholder={t('onboarding:enterQualification')}
                register={register("qualification_en")}
                error={errors.qualification_en}
              />
              <TextInput
                id="qualification_ar"
                label={t('onboarding:qualification_ar')}
                placeholder={t('onboarding:enterQualificationAr')}
                register={register("qualification_ar")}
                error={errors.qualification_ar}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                id="department"
                label={t('onboarding:selectDepartment')}
                placeholder={t('onboarding:chooseDepartment')}
                register={register("department")}
                error={errors.department}
              >
                <option value="">{t('onboarding:chooseDepartment')}</option>
                {departmentsData?.map((dept: any) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </Select>
              <TextInput
                id="experience"
                label={t('onboarding:experienceYears')}
                type="number"
                placeholder={t('onboarding:enterExperience')}
                register={register("experience", { valueAsNumber: true })}
                error={errors.experience}
              />
              <Textarea
                id="description_en"
                label={t('onboarding:aboutYou_en')}
                placeholder={t('onboarding:enterDescription')}
                register={register("description_en")}
                className="col-span-2"
                error={errors.description_en}
              />
              <Textarea
                id="description_ar"
                label={t('onboarding:aboutYou_ar')}
                placeholder={t('onboarding:enterDescriptionAr')}
                register={register("description_ar")}
                className="col-span-2"
                error={errors.description_ar}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <TextInput
                id="fee"
                label={t('onboarding:consultationFee')}
                type="number"
                placeholder={t('onboarding:enterFee')}
                register={register("fee", { valueAsNumber: true })}
                error={errors.fee}
              />
              {fields.map((scheduleItem, index) => (
                <div key={scheduleItem.id} className="p-4 border border-primaryBorder rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  <Select
                    id={`schedule-day-${index}`}
                    label={t('onboarding:selectDay')}
                    register={register(`schedule.${index}.day`)}
                    error={errors.schedule?.[index]?.day}
                  >
                    {DAYS.map((day) => (
                      <option
                        key={day.value}
                        value={day.value}
                        disabled={schedule.some((item, i) => i !== index && item.day === day.value)}
                      >
                        {getDayLabel(day.value)}
                      </option>
                    ))}
                  </Select>
                  <TextInput
                    id={`schedule-start-${index}`}
                    label={t('onboarding:from')}
                    type="time"
                    register={register(`schedule.${index}.startTime`)}
                    error={errors.schedule?.[index]?.startTime}
                  />
                  <TextInput
                    id={`schedule-end-${index}`}
                    label={t('onboarding:to')}
                    type="time"
                    register={register(`schedule.${index}.endTime`)}
                    error={errors.schedule?.[index]?.endTime}
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition-colors"
                      aria-label={t('onboarding:removeDay')}
                      title={t('onboarding:removeDay')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAppend}
                className="w-full border-dashed border-2"
                disabled={availableDays.length === 0}
              >
                <Plus size={16} /> {t('onboarding:addDay')}
              </Button>
              {availableDays.length === 0 && (
                <p className="text-green-600 text-sm text-center">
                  {t('onboarding:allDaysAdded')}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-primaryBorder">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isPending}
            >
              {t('onboarding:previous')}
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={isPending}
            >
              {currentStep < ONBOARDING_STEPS.length ? (
                t('onboarding:next')
              ) : isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  {t('onboarding:submitting')}
                </>
              ) : (
                t('onboarding:completeRegistration')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};