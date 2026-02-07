import { useEffect } from "react";
import { User, Phone, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../ui/TextInput";
import { Button } from "../../ui/Button";
import { Select } from "../../ui/Select";
import { Textarea } from "../../ui/Textarea";
import {
  patientProfileSchema,
  type PatientProfileFormData,
} from "../../../validations/patientProfileSchema";
import type { PatientProfileFormProps } from "../../../types/types";
import { useUpdateProfile } from "../../../hooks/patient/useUpdateProfile";
import { useTranslation } from "react-i18next";

const relationshipMap: Record<string, string> = {
  "أخ": "sibling",
  "زوج / زوجة": "spouse",
  "أب / أم": "parent",
  "ابن / ابنة": "child",
  "صديق": "friend",
  "أخرى": "other"
};

const reverseRelationshipMap: Record<string, string> = {
  "sibling": "أخ",
  "spouse": "زوج / زوجة",
  "parent": "أب / أم",
  "child": "ابن / ابنة",
  "friend": "صديق",
  "other": "أخرى"
};

const PatientProfileForm = ({
  userData,
  setIsEditing,
}: PatientProfileFormProps) => {
  const { t } = useTranslation("profile");

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

    const getReverseRelationship = (rel: string | undefined): string | undefined => {
      if (!rel) return undefined;
      return reverseRelationshipMap[rel] || rel;
    };

    reset({
      firstName: userData.firstName ?? "",
      lastName: userData.lastName ?? "",
      phone: userData.phone ?? "",
      dateOfBirth: userData.dateOfBirth
        ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
        : "",
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
          relationship: getReverseRelationship(userData.emergencyContact.relationship),
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
    const getRelationship = (rel: string | undefined): string | undefined => {
      if (!rel) return undefined;
      return relationshipMap[rel] || rel;
    };

    const payload = {
      ...data,
      emergencyContact: data.emergencyContact ? {
        ...data.emergencyContact,
        relationship: getRelationship(data.emergencyContact.relationship),
      } : undefined,
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
      className="space-y-6 md:space-y-8 bg-white p-4 sm:p-6 md:p-8 rounded-xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-4">
        <TextInput
          id="phone"
          label={t("phone")}
          Icon={Phone}
          placeholder="01XXXXXXXXX"
          register={register("phone")}
          error={errors.phone}
        />

        <TextInput
          id="dateOfBirth"
          label={t("dateOfBirth")}
          type="date"
          placeholder={t("dateOfBirth")}
          register={register("dateOfBirth")}
          error={errors.dateOfBirth}
        />
        
        <TextInput
          id="firstName"
          label={t("firstName")}
          Icon={User}
          placeholder={t("firstName")}
          register={register("firstName")}
          error={errors.firstName}
        />
        
        <TextInput
          id="lastName"
          label={t("lastName")}
          Icon={User}
          placeholder={t("lastName")}
          register={register("lastName")}
          error={errors.lastName}
        />
        
        <Select
          id="gender"
          label={t("gender")}
          register={register("gender")}
          error={errors.gender}
        >
          <option value="">{t("chooseGender")}</option>
          <option value="male">{t("male")}</option>
          <option value="female">{t("female")}</option>
          <option value="other">{t("other")}</option>
          <option value="prefer-not-to-say">{t("preferNotToSay")}</option>
        </Select>

        <Select
          id="bloodGroup"
          label={t("bloodGroup")}
          register={register("bloodGroup")}
          error={errors.bloodGroup}
        >
          <option value="">{t("chooseBloodGroup")}</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="Unknown">{t("unknown")}</option>
        </Select>
      </div>

      <h3 className="font-bold text-lg sm:text-xl text-primaryText">{t("address")}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-4">
        <TextInput
          id="street"
          label={t("street")}
          placeholder={t("street")}
          register={register("address.street")}
          error={errors.address?.street}
        />
        <TextInput
          id="city"
          label={t("city")}
          placeholder={t("city")}
          register={register("address.city")}
          error={errors.address?.city}
        />
        <TextInput
          id="state"
          label={t("state")}
          placeholder={t("state")}
          register={register("address.state")}
          error={errors.address?.state}
        />
        <TextInput
          id="country"
          label={t("country")}
          placeholder={t("country")}
          register={register("address.country")}
          error={errors.address?.country}
        />
        <TextInput
          id="pincode"
          label={t("pincode")}
          placeholder="12345"
          register={register("address.pincode")}
          error={errors.address?.pincode}
        />
      </div>

      <h3 className="font-bold text-lg sm:text-xl text-primaryText">
        {t("emergencyContact")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-4">
        <TextInput
          id="emergencyName"
          label={t("contactName")}
          placeholder={t("contactName")}
          register={register("emergencyContact.name")}
          error={errors.emergencyContact?.name}
        />
        <TextInput
          id="emergencyPhone"
          label={t("contactPhone")}
          placeholder={t("contactPhone")}
          register={register("emergencyContact.phone")}
          error={errors.emergencyContact?.phone}
        />

        <Select
          id="relationship"
          label={t("relationship")}
          register={register("emergencyContact.relationship")}
          error={errors.emergencyContact?.relationship}
        >
          <option value="">{t("chooseRelationship")}</option>
          <option value="زوج / زوجة">{t("spouse")}</option>
          <option value="أب / أم">{t("parent")}</option>
          <option value="ابن / ابنة">{t("child")}</option>
          <option value="أخ">{t("sibling")}</option>
          <option value="صديق">{t("friend")}</option>
          <option value="أخرى">{t("otherRelationship")}</option>
        </Select>
      </div>

      <h3 className="font-bold text-lg sm:text-xl text-primaryText">{t("medicalInfo")}</h3>

      <Textarea
        id="medicalHistory"
        label={t("medicalHistory")}
        placeholder={t("chronicDiseases")}
        register={register("medicalHistory")}
        error={errors.medicalHistory}
      />

      <TextInput
        id="allergies"
        label={t("allergies")}
        placeholder={t("allergiesPlaceholder")}
        register={register("allergies")}
        error={errors.allergies}
      />

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full sm:w-auto"
        >
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              {t("saving")}
            </div>
          ) : (
            t("saveChanges")
          )}
        </Button>
      </div>
    </form>
  );
};

export default PatientProfileForm;