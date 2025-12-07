import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import fs from "fs";

// Load env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY!,
});

type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

/**
 * Upload file to Cloudinary
 * Supports both filePath (local) and buffer (memory)
 */
export async function uploadOnCloudinary(
  input: string | Buffer,
  folder?: string,
  publicId?: string
): Promise<CloudinaryResponse | null> {
  if (!input) return null;

  try {
    // If input is a string, treat as path (your old behavior)
    if (typeof input === "string") {
      const res = await cloudinary.uploader.upload(input, {
        folder,
        public_id: publicId,
        resource_type: "image",
      });

      // Clean up local file if exists
      if (fs.existsSync(input)) {
        fs.unlinkSync(input);
      }
      return res;
    }

    // If input is a Buffer, stream upload
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryResponse);
        }
      );
      uploadStream.end(input);
    });
  } catch (error) {
    if (typeof input === "string" && fs.existsSync(input)) {
      fs.unlinkSync(input);
    }
    throw error;
  }
}
