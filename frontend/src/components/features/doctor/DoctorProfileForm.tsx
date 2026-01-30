import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  X,
  User
} from "lucide-react";
import { Button } from "../../ui/Button";
import { TextInput } from "../../ui/TextInput";
import { Textarea } from "../../ui/Textarea";
import { Select } from "../../ui/Select";
import { useUpdateDoctorImage } from "../../../hooks/doctor/useUpdateDoctorImage";
import { useUpdateDoctorProfileInfo } from "../../../hooks/doctor/useUpdateDoctorProfileInfo";
import { useGetDepartment } from "../../../hooks/department/useGetDepartment";
import type { DayType, DoctorProfileFormProps, ScheduleSlot } from "../../../types/types";
import {
  doctorProfileSchema,
  type doctorProfileFormData
} from "../../../validations/doctorProfileSchema";
import { DAYS } from "../../../constants/constants";




const DoctorProfileForm = ({
  userData,
  setIsEditing,
}: DoctorProfileFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateDoctorProfileInfo();
  const { mutate: updateImage, isPending: isUpdatingImage } = useUpdateDoctorImage();
  const { data: departmentsData } = useGetDepartment();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<doctorProfileFormData>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      department: typeof userData?.department === 'string' ? userData.department : userData?.department?._id || "",
      specialization_en: userData?.specialization_en || "",
      specialization_ar: userData?.specialization_ar || "",
      qualification_en: userData?.qualification_en || "",
      qualification_ar: userData?.qualification_ar || "",
      experience: userData?.experience || 0,
      fee: userData?.fee || 0,
      description_en: userData?.description_en || "",
      description_ar: userData?.description_ar || "",
      schedule: userData?.schedule || [],
    },
  });

  const watchedSchedule = watch("schedule");

  useEffect(() => {
    if (userData) {
      reset({
        department: typeof userData.department === 'string' ? userData.department : userData.department?._id || "",
        specialization_en: userData.specialization_en || "",
        specialization_ar: userData.specialization_ar || "",
        qualification_en: userData.qualification_en || "",
        qualification_ar: userData.qualification_ar || "",
        experience: userData.experience || 0,
        fee: userData.fee || 0,
        description_en: userData.description_en || "",
        description_ar: userData.description_ar || "",
        schedule: userData.schedule || [],
      });
    }
  }, [userData, reset]);

  const handleFormSubmit = (data: doctorProfileFormData) => {
    const cleanData: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        return;
      }
      
      if (Array.isArray(value) && value.length === 0) {
        return;
      }
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) {
        return;
      }
      
      cleanData[key] = value;
    });

    updateProfile(cleanData, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImagePreview(fileReader.result as string);
    };
    fileReader.readAsDataURL(selectedFile);

    const imageFormData = new FormData();
    imageFormData.append("image", selectedFile);
    updateImage(imageFormData);
  };

  const handleAddScheduleSlot = () => {
    const currentSchedule = watchedSchedule || [];
    const updatedSchedule = [...currentSchedule, {
      day: "monday" as DayType,
      startTime: "09:00",
      endTime: "17:00"
    }];
    setValue("schedule", updatedSchedule, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveScheduleSlot = (indexToRemove: number) => {
    const currentSchedule = watchedSchedule || [];
    const updatedSchedule = currentSchedule.filter((_, currentIndex) => currentIndex !== indexToRemove);
    setValue("schedule", updatedSchedule, { shouldValidate: true, shouldDirty: true });
  };

  const handleUpdateScheduleSlot = (index: number, fieldName: 'day' | 'startTime' | 'endTime', newValue: string) => {
    const currentSchedule = watchedSchedule || [];
    const updatedSchedule = [...currentSchedule];
    
    if (fieldName === 'day') {
      updatedSchedule[index] = { ...updatedSchedule[index], [fieldName]: newValue as DayType };
    } else {
      updatedSchedule[index] = { ...updatedSchedule[index], [fieldName]: newValue };
    }
    
    setValue("schedule", updatedSchedule, { shouldValidate: true, shouldDirty: true });
  };

  const getUnselectedDays = (currentSlotIndex: number) => {
    const selectedDays = watchedSchedule?.map((slot, index) => 
      index === currentSlotIndex ? null : slot.day
    ) || [];
    
    return DAYS.filter(day => !selectedDays.includes(day.value));
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8 bg-white p-8 rounded-xl"
    >
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={imagePreview || userData?.image || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            <label className="absolute bottom-0 right-0 bg-primary  p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <User className="h-4 w-4 " color="white" />
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleProfileImageChange}
                disabled={isUpdatingImage}
                title="Upload profile picture"
                aria-label="Upload profile picture"
              />
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
            <p className="text-xs text-gray-500">JPG, PNG, WebP up to 5MB</p>
            {isUpdatingImage && (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-bold text-xl text-primaryText">Personal Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={userData?.firstName || ""}
            disabled
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
            aria-label="First name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={userData?.lastName || ""}
            disabled
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
            aria-label="Last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={userData?.email || ""}
            disabled
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
            aria-label="Email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={userData?.phone || ""}
            disabled
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
            aria-label="Phone"
          />
        </div>
      </div>

      <h3 className="font-bold text-xl text-primaryText">Professional Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="department"
          label="Department"
          register={register("department")}
          error={errors.department}
          isDashboard={true}
        >
          <option value="">Select Department</option>
          {departmentsData?.departments?.map((departmentItem: any) => (
            <option key={departmentItem._id} value={departmentItem._id}>
              {departmentItem.name_en}
            </option>
          ))}
        </Select>
        <TextInput
          label="Specialization (English)"
          Icon={GraduationCap}
          type="text"
          placeholder="Cardiologist"
          register={register("specialization_en")}
          error={errors.specialization_en}
          id="specialization_en"
          isDashboard={true}
        />
        <TextInput
          label="Specialization (Arabic)"
          Icon={GraduationCap}
          type="text"
          placeholder="طبيب قلب"
          register={register("specialization_ar")}
          error={errors.specialization_ar}
          id="specialization_ar"
          isDashboard={true}
        />
        <TextInput
          label="Qualification (English)"
          Icon={GraduationCap}
          type="text"
          placeholder="MBBS, MD"
          register={register("qualification_en")}
          error={errors.qualification_en}
          id="qualification_en"
          isDashboard={true}
        />
        <TextInput
          label="Qualification (Arabic)"
          Icon={GraduationCap}
          type="text"
          placeholder="ماجستير، دكتوراه"
          register={register("qualification_ar")}
          error={errors.qualification_ar}
          id="qualification_ar"
          isDashboard={true}
        />
        <TextInput
          label="Experience (Years)"
          Icon={Briefcase}
          type="number"
          placeholder="10"
          register={register("experience", { valueAsNumber: true })}
          error={errors.experience}
          id="experience"
          isDashboard={true}
        />
        <TextInput
          label="Consultation Fee"
          Icon={DollarSign}
          type="number"
          placeholder="400"
          register={register("fee", { valueAsNumber: true })}
          error={errors.fee}
          id="fee"
          isDashboard={true}
        />
      </div>

      <h3 className="font-bold text-xl text-primaryText">Description</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Description (English)"
          placeholder="Describe your experience, specialization, and approach to patient care..."
          register={register("description_en")}
          error={errors.description_en}
          id="description_en"
          requiredInput={false}
          isDashboard={true}
        />
        <Textarea
          label="Description (Arabic)"
          placeholder="أوصف خبرتك وتخصصك ونهجك في رعاية المرضى..."
          register={register("description_ar")}
          error={errors.description_ar}
          id="description_ar"
          requiredInput={false}
          isDashboard={true}
        />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-primaryText">Weekly Schedule</h3>
          <Button
            type="button"
            onClick={handleAddScheduleSlot}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            + Add Time Slot
          </Button>
        </div>

        {watchedSchedule.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No schedule added yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your working hours for each day</p>
          </div>
        ) : (
          <div className="space-y-4">
            {watchedSchedule.map((scheduleSlot: ScheduleSlot, scheduleIndex: number) => {
              const unselectedDays = getUnselectedDays(scheduleIndex);

              return (
                <div key={scheduleIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Time Slot {scheduleIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleSlot(scheduleIndex)}
                      className="text-gray-500 hover:text-red-500"
                      aria-label="Remove time slot"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day
                      </label>
                      <select
                        value={scheduleSlot.day}
                        onChange={(event) => handleUpdateScheduleSlot(scheduleIndex, 'day', event.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        title="Select day"
                        aria-label="Select day"
                      >
                        <option value="">Select Day</option>
                        {unselectedDays.map((dayItem) => (
                          <option key={dayItem.value} value={dayItem.value}>
                            {dayItem.label}
                          </option>
                        ))}
                        <option value={scheduleSlot.day}>
                          {DAYS.find(day => day.value === scheduleSlot.day)?.label}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={scheduleSlot.startTime}
                        onChange={(event) => handleUpdateScheduleSlot(scheduleIndex, 'startTime', event.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        title="Select start time"
                        aria-label="Select start time"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={scheduleSlot.endTime}
                        onChange={(event) => handleUpdateScheduleSlot(scheduleIndex, 'endTime', event.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        title="Select end time"
                        aria-label="Select end time"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isUpdatingProfile || !isDirty}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdatingProfile ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default DoctorProfileForm;