import { useState } from "react";
import {
  Calendar,
  Edit,
  Mail,
  Phone,
  Shield,
  User,
  MapPin,
  Heart,
} from "lucide-react";
import { Button } from "../../ui/Button";
import InfoItem from "./InfoItem";
import { formatDate } from "../../../utils/formatDate";
import type { PatientPersonalInfoProps } from "../../../types/types";
import PatientProfileForm from "./PatientProfileForm";
import { useTranslation } from "react-i18next";

export const PatientPersonalInfo = ({ userData }: PatientPersonalInfoProps) => {
  const { t } = useTranslation("profile");
  const [isEditing, setIsEditing] = useState(false);

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t("notSpecified")}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <PatientProfileForm userData={userData} setIsEditing={setIsEditing} />
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-primaryText">
          {t("personalInfo")}
        </h2>
        <Button
          onClick={() => setIsEditing(true)}
          className="gap-2 w-full sm:w-auto"
        >
          <Edit className="w-4 h-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <InfoItem
            icon={User}
            label={t("fullName")}
            value={
              `${userData.firstName} ${userData.lastName}`.trim() || t("notSpecified")
            }
          />
          <InfoItem
            icon={Mail}
            label={t("email")}
            value={userData.email || t("notSpecified")}
          />
          <InfoItem
            icon={Phone}
            label={t("phone")}
            value={userData.phone || t("notSpecified")}
          />
          <InfoItem
            icon={Calendar}
            label={t("dateOfBirth")}
            value={formatDate(userData.dateOfBirth) || t("notSpecified")}
          />
          <InfoItem
            icon={User}
            label={t("gender")}
            value={userData.gender || t("notSpecified")}
          />
          <InfoItem
            icon={Shield}
            label={t("bloodGroup")}
            value={userData.bloodGroup || t("notSpecified")}
          />
        </div>
      </div>

      {userData.address && (
        <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{t("address")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <InfoItem
              icon={MapPin}
              label={t("street")}
              value={userData.address.street || t("notSpecified")}
            />
            <InfoItem
              icon={MapPin}
              label={t("city")}
              value={userData.address.city || t("notSpecified")}
            />
            <InfoItem
              icon={MapPin}
              label={t("state")}
              value={userData.address.state || t("notSpecified")}
            />
            <InfoItem
              icon={MapPin}
              label={t("country")}
              value={userData.address.country || t("notSpecified")}
            />
            <InfoItem
              icon={MapPin}
              label={t("pincode")}
              value={userData.address.pincode || t("notSpecified")}
            />
          </div>
        </div>
      )}

      {userData.emergencyContact && (
        <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{t("emergencyContact")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <InfoItem
              icon={User}
              label={t("contactName")}
              value={userData.emergencyContact?.name || t("notSpecified")}
            />
            <InfoItem
              icon={Heart}
              label={t("relationship")}
              value={userData.emergencyContact?.relationship || t("notSpecified")}
            />
            <InfoItem
              icon={Phone}
              label={t("contactPhone")}
              value={userData.emergencyContact?.phone || t("notSpecified")}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl md:rounded-2xl border border-primaryBorder p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{t("medicalInfo")}</h3>

        <div className="mb-4 md:mb-6">
          <h4 className="font-medium text-gray-700 mb-2 md:mb-3">{t("allergies")}</h4>
          {userData.allergies && userData.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userData.allergies.map((allergy: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 md:px-4 md:py-2 bg-primary/5 text-primary rounded-full text-xs md:text-sm"
                >
                  {allergy}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm md:text-base">{t("noAllergies")}</p>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2 md:mb-3">{t("medicalHistory")}</h4>
          <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
            {userData.medicalHistory || t("noMedicalHistory")}
          </p>
        </div>
      </div>
    </div>
  );
};