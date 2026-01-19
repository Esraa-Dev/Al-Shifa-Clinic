import { ApiError } from "./ApiError.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUploadImage = async (fileToUpload: string) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      folder: "patient_profiles",
    });
    return data;
  } catch (error: any) {
    throw new ApiError("Failed to upload image. Please try again later.", 500);
  }
};

export const cloudinaryRemoveImage = async (imagePublicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error: any) {
    throw new ApiError("Failed to remove image. Please try again later.", 500);
  }
};
