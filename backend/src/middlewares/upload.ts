import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'ecommerce',
    resource_type: 'image',
    format: undefined,
  }),
});

export const upload = multer({ storage });
