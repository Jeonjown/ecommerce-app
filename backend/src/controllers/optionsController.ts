import { Request, Response, NextFunction } from 'express';

import {
  getAllOptions,
  getOptionsandValuesByProductId,
} from '../models/optionModel';

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
    const { id } = req.params;
    const options = await getAllOptions();

    res.status(200).json({ options });
  } catch (error) {
    next(error);
  }
};
