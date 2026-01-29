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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primaryText">
          {t("personalInfo")}
        </h2>
        <Button onClick={() => setIsEditing(true)} className="gap-2">
          <Edit className="w-4 h-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-primaryBorder p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="bg-white rounded-2xl border border-primaryBorder p-6">
          <h3 className="text-xl font-bold mb-6">{t("address")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="bg-white rounded-2xl border border-primaryBorder p-6">
          <h3 className="text-xl font-bold mb-6">{t("emergencyContact")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="bg-white rounded-2xl border border-primaryBorder p-6">
        <h3 className="text-xl font-bold mb-6">{t("medicalInfo")}</h3>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">{t("allergies")}</h4>
          {userData.allergies && userData.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userData.allergies.map((allergy: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/5 text-primary rounded-full text-sm"
                >
                  {allergy}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t("noAllergies")}</p>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">{t("medicalHistory")}</h4>
          <p className="text-gray-700 whitespace-pre-line">
            {userData.medicalHistory || t("noMedicalHistory")}
          </p>
        </div>
      </div>
    </div>
  );
};