import { v2 as cloudinary } from 'cloudinary';

export const deleteImageByUrl = async (imageUrl: string) => {
  if (!imageUrl) throw new Error('Image URL is required.');

  const matches = imageUrl.match(
    /\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|webp|gif|bmp|tiff|svg)$/
  );

  const publicId = matches?.[1];
  console.log(publicId);

  if (!publicId) {
    throw new Error('Failed to extract public_id from image URL.');
  }

  await cloudinary.uploader.destroy(publicId);
};
