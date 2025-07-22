import { Request, Response, NextFunction } from 'express';
import { createOptionValue } from '../models/optionValueModel';
import { ApiError } from '../utils/ApiError';
import { generateSlug } from '../utils/generateSlug';

export const createOptionValueController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    if (!value || !id)
      throw new ApiError('Please provide name and option id', 400);

    const slug = await generateSlug(value, 'product_option_values');

    const optionValue = await createOptionValue(Number(id), value, slug);
    if (!optionValue) {
      throw new ApiError('Product option not found', 404);
    }

    res.status(200).json({
      message: 'option value created successfully.',
      optionValue,
    });
    return;
  } catch (error) {
    next(error);
  }
};
