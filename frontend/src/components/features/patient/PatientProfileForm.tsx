import { useEffect } from "react";
import { User, Phone, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../ui/TextInput";
import { Button } from "../../ui/Button";
import {
  patientProfileSchema,
  type PatientProfileFormData,
} from "../../../validations/patientProfileSchema";
import type { PatientProfileFormProps } from "../../../types/types";
import { useUpdateProfile } from "../../../hooks/patient/useUpdateProfile";

const PatientProfileForm = ({
  userData,
  setIsEditing,
}: PatientProfileFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PatientProfileFormData>({
    resolver: zodResolver(patientProfileSchema),
    shouldFocusError: false,
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
      bloodGroup: undefined,
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
      emergencyContact: {
        name: "",
        phone: "",
        relationship: undefined,
      },
      medicalHistory: "",
      allergies: "",
    },
  });

  const { mutate, isPending } = useUpdateProfile();

  useEffect(() => {
    if (!userData) return;

    reset({
      firstName: userData.firstName ?? "",
      lastName: userData.lastName ?? "",
      phone: userData.phone ?? "",
      dateOfBirth: userData.dateOfBirth
        ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
        : "",
      // Cast string to enum types
      gender: userData.gender as "male" | "female" | "other" | "prefer-not-to-say" | undefined,
      bloodGroup: userData.bloodGroup as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown" | undefined,
      address: {
        street: userData.address?.street ?? "",
        city: userData.address?.city ?? "",
        state: userData.address?.state ?? "",
        country: userData.address?.country ?? "",
        pincode: userData.address?.pincode ?? "",
      },
      emergencyContact: userData.emergencyContact
        ? {
            name: userData.emergencyContact.name ?? "",
            phone: userData.emergencyContact.phone ?? "",
            // Cast string to enum type
            relationship: userData.emergencyContact.relationship as 
              "spouse" | "parent" | "child" | "sibling" | "friend" | "other" | undefined,
          }
        : {
            name: "",
            phone: "",
            relationship: undefined,
          },
      medicalHistory: userData.medicalHistory ?? "",
      allergies: Array.isArray(userData.allergies)
        ? userData.allergies.join(", ")
        : "",
    });
  }, [userData, reset]);

  const onSubmit = (data: PatientProfileFormData) => {
    const payload = {
      ...data,
      allergies:
        typeof data.allergies === "string"
          ? data.allergies
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a !== "")
          : data.allergies,
    };

    mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white p-8 rounded-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="الاسم الأول"
          Icon={User}
          placeholder="أدخل الاسم الأول"
          register={register("firstName")}
          error={errors.firstName}
        />
        <TextInput
          label="اسم الأخير"
          Icon={User}
          placeholder="أدخل اسم الأخير"
          register={register("lastName")}
          error={errors.lastName}
        />
      </div>

      <TextInput
        label="رقم الهاتف"
        Icon={Phone}
        placeholder="مثال: 01XXXXXXXXX"
        register={register("phone")}
        error={errors.phone}
      />

      <TextInput
        label="تاريخ الميلاد"
        type="date"
        placeholder="اختر تاريخ الميلاد"
        register={register("dateOfBirth")}
        error={errors.dateOfBirth}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-primaryText">
            النوع
          </label>
          <select
            {...register("gender")}
            className="w-full border border-primaryBorder rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary text-gray-400 focus:text-primaryText"
          >
            <option value="">اختر النوع</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
            <option value="other">آخر</option>
            <option value="prefer-not-to-say">أفضل عدم الذكر</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-2">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-primaryText">
            فصيلة الدم
          </label>
          <select
            {...register("bloodGroup")}
            className="w-full border border-primaryBorder rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary text-gray-400 focus:text-primaryText"
          >
            <option value="">اختر فصيلة الدم</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Unknown">غير معروف</option>
          </select>
          {errors.bloodGroup && (
            <p className="text-red-500 text-sm mt-2">
              {errors.bloodGroup.message}
            </p>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-lg text-primaryText">العنوان</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="الشارع"
          placeholder="اسم الشارع / رقم المنزل"
          register={register("address.street")}
          error={errors.address?.street}
        />
        <TextInput
          label="المدينة"
          placeholder="أدخل المدينة"
          register={register("address.city")}
          error={errors.address?.city}
        />
        <TextInput
          label="المحافظة"
          placeholder="أدخل المحافظة"
          register={register("address.state")}
          error={errors.address?.state}
        />
        <TextInput
          label="الدولة"
          placeholder="أدخل الدولة"
          register={register("address.country")}
          error={errors.address?.country}
        />
        <TextInput
          label="الرمز البريدي"
          placeholder="مثال: 12345"
          register={register("address.pincode")}
          error={errors.address?.pincode}
        />
      </div>

      <h3 className="font-semibold text-lg text-primaryText">
        جهة اتصال للطوارئ
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="الاسم"
          placeholder="اسم جهة الاتصال"
          register={register("emergencyContact.name")}
          error={errors.emergencyContact?.name}
        />
        <TextInput
          label="رقم الهاتف"
          placeholder="رقم هاتف جهة الاتصال"
          register={register("emergencyContact.phone")}
          error={errors.emergencyContact?.phone}
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-primaryText">
            صلة القرابة
          </label>
          <select
            {...register("emergencyContact.relationship")}
            className="w-full border border-primaryBorder rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary text-gray-400 focus:text-primaryText"
          >
            <option value="">اختر صلة القرابة</option>
            <option value="spouse">زوج / زوجة</option>
            <option value="parent">أب / أم</option>
            <option value="child">ابن / ابنة</option>
            <option value="sibling">أخ / أخت</option>
            <option value="friend">صديق</option>
            <option value="other">أخرى</option>
          </select>
          {errors.emergencyContact?.relationship && (
            <p className="text-red-500 text-sm mt-2">
              {errors.emergencyContact.relationship.message}
            </p>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-lg text-primaryText">معلومات طبية</h3>

      <div>
        <label className="block mb-2 text-sm font-medium text-primaryText">
          التاريخ المرضي
        </label>
        <textarea
          {...register("medicalHistory")}
          rows={4}
          placeholder="اكتب أي أمراض مزمنة أو عمليات سابقة (اختياري)"
          className="w-full border border-primaryBorder rounded-lg px-4 py-3 text-sm bg-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.medicalHistory && (
          <p className="text-red-500 text-sm mt-2">
            {errors.medicalHistory.message}
          </p>
        )}
      </div>

      <TextInput
        label="الحساسية"
        placeholder="مثل: البنسلين، الغبار، أطعمة معينة"
        register={register("allergies")}
        error={errors.allergies}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              جاري الحفظ
            </div>
          ) : (
            "حفظ التعديلات"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PatientProfileForm;