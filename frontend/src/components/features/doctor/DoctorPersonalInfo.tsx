import { useState } from "react";
import {
  Edit,
  Mail,
  Phone,
  User,
  GraduationCap,
  Briefcase,
  DollarSign,
  FileText,
  CalendarClock,
  Clock
} from "lucide-react";
import { Button } from "../../ui/Button";
import InfoItem from "../patient/InfoItem";
import DoctorProfileForm from "./DoctorProfileForm";
import type { Doctor } from "../../../types/types";
interface DoctorPersonalInfoProps  {
  userData: Doctor;
}
const getDayLabel = (dayValue: string): string => {
  const dayMap: Record<string, string> = {
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday"
  };
  return dayMap[dayValue] || dayValue;
};

export const DoctorPersonalInfo = ({ userData }: DoctorPersonalInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data found</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <DoctorProfileForm userData={userData} setIsEditing={setIsEditing} />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primaryText">
          Profile Information
        </h2>
        <Button onClick={() => setIsEditing(true)} className="gap-2">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-primaryBorder p-6">
        <h3 className="text-xl font-bold mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={User}
            label="Full Name"
            value={`${userData.firstName} ${userData.lastName}`.trim() || "Not specified"}
          />
          <InfoItem
            icon={Mail}
            label="Email"
            value={userData.email || "Not specified"}
          />
          <InfoItem
            icon={Phone}
            label="Phone"
            value={userData.phone || "Not specified"}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-primaryBorder p-6">
        <h3 className="text-xl font-bold mb-6">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={GraduationCap}
            label="Specialization (English)"
            value={userData.specialization_en || "Not specified"}
          />
          <InfoItem
            icon={GraduationCap}
            label="Specialization (Arabic)"
            value={userData.specialization_ar || "Not specified"}
          />
          <InfoItem
            icon={FileText}
            label="Qualification (English)"
            value={userData.qualification_en || "Not specified"}
          />
          <InfoItem
            icon={FileText}
            label="Qualification (Arabic)"
            value={userData.qualification_ar || "Not specified"}
          />
          <InfoItem
            icon={Briefcase}
            label="Experience"
            value={`${userData.experience || 0} years`}
          />
          <InfoItem
            icon={DollarSign}
            label="Consultation Fee"
            value={`$${userData.fee || "0"}`}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-primaryBorder p-6">
        <h3 className="text-xl font-bold mb-6">Description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">English</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {userData.description_en || "No description provided"}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Arabic</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {userData.description_ar || "لا يوجد وصف"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-primaryBorder p-6">
        <h3 className="text-xl font-bold mb-6">Schedule</h3>
        {userData.schedule && userData.schedule.length > 0 ? (
          <div className="space-y-4">
            {userData.schedule.map((slot, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-gray-700">
                    {getDayLabel(slot.day)}
                  </h4>
                </div>
                <div className="flex items-center gap-4">
                  <InfoItem
                    icon={Clock}
                    label="From"
                    value={slot.startTime}
                  />
                  <InfoItem
                    icon={Clock}
                    label="To"
                    value={slot.endTime}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <CalendarClock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No schedule added yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your working hours for each day</p>
          </div>
        )}
      </div>
    </div>
  );
};