import { Request, Response, NextFunction } from 'express';
import {
  createCategory,
  deleteCategoryById,
  editCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
} from '../models/categoryModel';
import { ApiError } from '../utils/ApiError';
import { generateSlug } from '../utils/generateSlug';
import { getProductById } from '../models/productModel';

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

export const getCategoryByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const categories = await getCategoryById(Number(id));
    res.status(200).json({ categories });
    return;
  } catch (error) {
    next(new ApiError('Failed to fetch categories', 500));
  }
};

export const getProductsByCategorySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const category = await getCategoryBySlug(slug);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const products = await getProductById(category.id);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError('Please fill all credentials.', 400);
    }

    const slug = await generateSlug(name, 'categories');

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
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      throw new ApiError('Please fill all credentials.', 400);
    }

    const slug = await generateSlug(name, 'categories');

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
