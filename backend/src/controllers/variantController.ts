import { Request, Response, NextFunction } from 'express';
import { getVariantsByProductId } from '../models/variantModel';
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
