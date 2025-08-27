import { v2 as cloudinary } from 'cloudinary';

export const deleteImageByUrl = async (imageUrl?: string | null) => {
  if (!imageUrl) {
    console.warn('No image provided. Skipping deletion.');
    return;
  }

  const isCloudinary = imageUrl.includes('res.cloudinary.com');
  if (!isCloudinary) {
    console.warn('Skipping deletion: not a Cloudinary image.');
    return;
  }

  const matches = imageUrl.match(
    /\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|webp|gif|bmp|tiff|svg)$/
  );

  const publicId = matches?.[1];
  if (!publicId) {
    console.warn('Could not extract public_id from URL. Skipping deletion.');
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};
