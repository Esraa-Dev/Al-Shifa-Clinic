import { ProfileHeader } from "../components/shared/ProfileHeader";
import { DoctorPersonalInfo } from "../components/features/doctor/DoctorPersonalInfo";
import { useDoctorProfile } from "../hooks/doctor/useGetDoctorProfile";
import { useUpdateDoctorImage } from "../hooks/doctor/useUpdateDoctorImage";
import { ProfileSkeleton } from "../components/features/patient/ProfileSkeleton";

const DoctorProfileSettings = () => {
  const { data: doctor, isLoading, error } = useDoctorProfile();
  const { mutate: updateImage, isPending: isUpdatingImage } = useUpdateDoctorImage();

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="p-6 bg-background text-red-700 rounded-xl text-center h-full">
        <div className="mt-2 text-sm">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="bg-background py-10">
      <div className="container">
        <div className="bg-white/50 rounded-2xl border border-primaryBorder p-4 h-full mb-6">
          <ProfileHeader
            firstName={doctor.firstName}
            lastName={doctor.lastName}
            image={doctor.image}
            createdAt={doctor.createdAt}
            title="Dr."
            isUpdating={isUpdatingImage}
            onImageUpload={updateImage}
            isDoctor={true}
          />
        </div>
        <DoctorPersonalInfo userData={doctor} />
      </div>
    </div>
  );
};

export default DoctorProfileSettings;