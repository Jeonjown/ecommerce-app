import { Request, Response, NextFunction } from 'express';
import cloudinary from '../utils/cloudinary';
import { ApiError } from '../utils/ApiError';
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) throw new ApiError('No image uploaded', 400);

    res.status(200).json({
      url: (req.file as any).path,
      public_id: (req.file as any).filename,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { public_id } = req.body;
  if (!public_id) throw new ApiError('public_id required.', 400);

  try {
    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: 'Image deleted successfully.' });
    return;
  } catch (error) {
    next(error);
  }
};
