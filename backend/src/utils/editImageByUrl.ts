import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

interface EditImageOptions {
  oldImageUrl: string;
  newFilePath: string; // Absolute or relative path to local file
  folder?: string; // optional Cloudinary folder
}

export const editImageByUrl = async ({
  oldImageUrl,
  newFilePath,
  folder = 'variants',
}: EditImageOptions): Promise<UploadApiResponse> => {
  // Step 1: Extract public_id from the old image URL
  const matches = oldImageUrl.match(
    /\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|webp|gif|bmp|tiff|svg)$/
  );
  const oldPublicId = matches?.[1];

  if (!oldPublicId) {
    throw new Error('Failed to extract public_id from old image URL.');
  }

  // Step 2: Delete old image
  await cloudinary.uploader.destroy(oldPublicId);

  // Step 3: Upload new image
  const result = await cloudinary.uploader.upload(newFilePath, {
    folder,
  });

  return result; // contains secure_url, public_id, etc.
};
