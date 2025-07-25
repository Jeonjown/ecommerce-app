import { Request, Response, NextFunction } from 'express';

import {
  createOption,
  deleteOptionsByOptionsId,
  getAllOptions,
  getOptionsandValuesByProductId,
} from '../models/optionModel';
import { ApiError } from '../utils/ApiError';

export const getOptionsbyProductIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const options = await getOptionsandValuesByProductId(Number(id));

    res.status(200).json({ options });
  } catch (error) {
    next(error);
  }
};

export const getAllOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const options = await getAllOptions();

    res.status(200).json({ options });
  } catch (error) {
    next(error);
  }
};

export const createOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !id)
      throw new ApiError('Please provide name and product id', 400);

    const option_id = await createOption(Number(id), name);

    if (option_id === 0) throw new ApiError('No option value found', 404);

    res.status(200).json({
      message: 'option created successfully.',
      option: { option_id, name },
    });
  } catch (error) {
    next();
  }
};

export const deleteOptionsByOptionsIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new ApiError('Invalid option ID.', 400);
    }

    const result = await deleteOptionsByOptionsId(numericId);

    if (result === 0) {
      throw new ApiError('Option not found', 404);
    }

    res.status(200).json({ message: 'Option deleted successfully.' });
    return;
  } catch (error) {
    next(new ApiError('Error deleting option', 500));
  }
};
