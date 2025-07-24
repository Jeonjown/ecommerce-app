import { Request, Response, NextFunction } from 'express';
import {
  deleteVariantById,
  getVariantOptionsByVariantId,
  getVariantsByProductId,
} from '../models/variantModel';
import { ApiError } from '../utils/ApiError';

export const getVariantbyIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const variant = await getVariantsByProductId(Number(id));

    if (!variant) throw new ApiError('No variant found', 400);

    res.status(200).json(variant);
  } catch (error) {
    next(error);
  }
};

export const deleteVariantByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError('Variant ID is required', 400);

    await deleteVariantById(Number(id));

    res.status(200).json({ message: 'Variant deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getVariantOptionsByVariantIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const variantId = parseInt(id);

    if (isNaN(variantId)) {
      throw new ApiError('Variant ID is required', 400);
    }

    const options = await getVariantOptionsByVariantId(variantId);
    res.json(options);
  } catch (error) {
    next(error);
  }
};
