import { Request, Response, NextFunction } from 'express';
import {
  createProduct,
  deleteProduct,
  editProduct,
  editProductWithVariants,
  getProduct,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '../models/productModel';
import { ApiError } from '../utils/ApiError';
import { createSlug } from '../utils/createSlug';
import { generateSku } from '../utils/generateSku';

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, category_id } = req.query;

    if (typeof search === 'string' && search.trim()) {
      const products = await searchProducts(search);
      res.status(200).json({ products });
      return;
    }

    if (category_id) {
      const products = await getProductsByCategory(Number(category_id));
      res.status(200).json({ products });
      return;
    }

    const products = await getProducts();
    res.status(200).json({ products });
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
    const { category_id, name, description, image_url, is_active, variants } =
      req.body;

    if (!name || !category_id || !image_url || !description) {
      throw new ApiError('Required fields are missing.', 400);
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      throw new ApiError('At least one variant is required.', 400);
    }

    const slug = createSlug(name);

    const enrichedVariants = variants.map((variant: any) => ({
      ...variant,
      sku:
        variant.sku && variant.sku.trim()
          ? variant.sku
          : generateSku(
              name,
              variant.option1,
              variant.option2,
              variant.option3
            ),
    }));

    const product = await createProduct(
      {
        category_id,
        name,
        description,
        image_url,
        is_active,
        slug,
      },
      enrichedVariants
    );

    res.status(201).json({
      message: 'Product created successfully.',
      product,
    });
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

    const { variants, ...productFields } = req.body;

    if (variants) {
      if (!Array.isArray(variants) || variants.length === 0) {
        throw new ApiError(
          'At least one variant is required when updating variants.',
          400
        );
      }

      const enrichedVariants = variants.map((variant: any) => ({
        ...variant,
        sku:
          variant.sku && variant.sku.trim()
            ? variant.sku
            : generateSku(
                productFields.name || 'PRODUCT',
                variant.option1,
                variant.option2,
                variant.option3
              ),
      }));

      await editProductWithVariants(
        Number(id),
        productFields,
        enrichedVariants
      );

      const updated = await getProduct(Number(id));
      res.status(200).json({
        message: 'Product and variants updated successfully.',
        product: updated,
      });
    } else {
      const product = await editProduct(Number(id), productFields);
      res.status(200).json({
        message: 'Product updated successfully.',
        product,
      });
    }
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
