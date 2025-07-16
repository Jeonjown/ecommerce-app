import { Request, Response, NextFunction } from 'express';
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '../models/productModel';
import { ApiError } from '../utils/ApiError';
import { createSlug } from '../utils/createSlug';

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, categoryId } = req.query;

    // Search has priority
    if (typeof search === 'string' && search.trim()) {
      const products = await searchProducts(search);
      res.status(200).json({ products });
      return;
    }

    // Filter by category if present
    if (categoryId) {
      const products = await getProductsByCategory(Number(categoryId));
      res.status(200).json({ products });
      return;
    }

    // Return all if no filters
    const products = await getProducts();
    res.status(200).json({ products });
    return;
  } catch (error) {
    next(error);
  }
};

export const getProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await getProduct(Number(id));

    if (!product) {
      throw new ApiError('No product found.', 404);
    }

    res.status(200).json({ product });
    return;
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      stock,
      image_url,
      is_active,
    } = req.body;

    if (!name || !category_id || price == null || !image_url || !description) {
      throw new ApiError('Required fields are missing.', 400);
    }

    const slug = createSlug(name);

    const product = await createProduct({
      category_id,
      name,
      description,
      price,
      stock,
      image_url,
      is_active,
      slug,
    });

    res
      .status(201)
      .json({ message: 'Product created successfully.', ...product });
  } catch (error) {
    next(error);
  }
};

export const editProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError('Product ID is required.', 400);
    }

    const payload = req.body;

    const product = await editProduct(Number(id), payload);

    res.status(200).json({
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError('Product ID is required.', 400);
    }

    const product = await deleteProduct(Number(id));

    res.status(200).json({
      message: 'Product deleted successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};
