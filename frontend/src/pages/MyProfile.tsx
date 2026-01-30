import { useGetProfile } from "../hooks/patient/useGetProfile";
import { PatientPersonalInfo } from "../components/features/patient/PatientPersonalInfo";
import { ProfileHeader } from "../components/shared/ProfileHeader";
import { useUpdateProfileImage } from "../hooks/patient/useUpdateProfileImage";
import { ProfileSkeleton } from "../components/features/patient/ProfileSkeleton";

const MyProfile = () => {
  const { data: profile, isLoading, error } = useGetProfile();
  const { mutate: updateImage, isPending: isUpdatingImage } = useUpdateProfileImage();

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
            firstName={profile.firstName}
            lastName={profile.lastName}
            image={profile.image}
            createdAt={profile.createdAt}
            title="" 
            isUpdating={isUpdatingImage}
            onImageUpload={updateImage}
            isDoctor={false}
          />
        </div>
        <PatientPersonalInfo userData={profile} />
      </div>
    </div>
  );
};

export default MyProfile;