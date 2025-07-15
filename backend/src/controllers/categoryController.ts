import { Request, Response, NextFunction } from 'express';
import {
  createCategory,
  deleteCategoryById,
  editCategory,
  getCategories,
} from '../models/categoryModel';
import { ApiError } from '../utils/ApiError';

export const getCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await getCategories();
    res.status(200).json({ categories });
    return;
  } catch (error) {
    next(new ApiError('Failed to fetch categories', 500));
  }
};

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      throw new ApiError('Please fill all credentials.', 400);
    }

    const category = await createCategory(name, slug);
    res
      .status(201)
      .json({ message: 'Category created successfully', category });
    return;
  } catch (error) {
    next(error);
  }
};

export const editCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug } = req.body;
    const { id } = req.params;

    if (!name || !slug) {
      throw new ApiError('Please fill all credentials.', 400);
    }

    const updatedCategory = await editCategory(Number(id), { name, slug });

    if (!updatedCategory) {
      throw new ApiError('Category not found.', 404);
    }

    res.status(200).json({
      message: 'Category updated successfully',
      updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      throw new ApiError('Invalid category ID.', 400);
    }

    const result = await deleteCategoryById(idNumber);

    if (result.affectedRows === 0) {
      throw new ApiError('Category not found.', 404);
    }

    res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
