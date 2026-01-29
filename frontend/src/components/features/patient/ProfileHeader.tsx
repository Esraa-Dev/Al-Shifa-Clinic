import { Pencil, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUpdateProfileImage } from "../../../hooks/patient/useUpdateProfileImage";
import { formatYear } from "../../../utils/formatYear";
import type { ProfileHeaderProps } from "../../../types/types";
import {
  profileImageSchema,
  type ProfileImageFormData,
} from "../../../validations/profileImageSchema";

export const ProfileHeader = ({
  firstName,
  lastName,
  image,
  createdAt,
}: ProfileHeaderProps) => {
  const { mutate, isPending } = useUpdateProfileImage();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileImageFormData>({
    resolver: zodResolver(profileImageSchema),
  });

  const onSubmit = (data: ProfileImageFormData) => {
    const formData = new FormData();
    formData.append("image", data.image);
    mutate(formData);
  };

  return (
    <div className="bg-linear-to-br from-primary to-secondary rounded-xl border border-primaryBorder p-6 sticky top-5">
      <div className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative w-24 h-24 mx-auto mb-2">
            {image ? (
              <img
                src={image}
                alt={firstName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center text-primary text-3xl font-bold">
                {firstName.charAt(0)}
              </div>
            )}

            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition">
              {isPending ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Pencil className="w-5 h-5 text-white" />
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                {...register("image")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("image", file, { shouldValidate: true });
                    handleSubmit(onSubmit)();
                  }
                }}
                disabled={isPending}
              />
            </label>
          </div>

          {errors.image && (
            <div className="bg-white p-2 rounded-sm mb-2">
              <p className="text-xs text-red-400 font-bold mt-1">{errors.image.message}</p>
            </div>

          )}
        </form>

        <h2 className="text-xl font-bold text-white">
          {firstName} {lastName}
        </h2>

        <p className="text-white text-sm">عضو منذ {formatYear(createdAt)}</p>
      </div>
    </div>
  );
};
