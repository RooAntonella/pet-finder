import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPetImage(imageData: string) {
  const result = await cloudinary.uploader.upload(imageData, {
    folder: "pet-finder",
  });

  return result.secure_url;
}
