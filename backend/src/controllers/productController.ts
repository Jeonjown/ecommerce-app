// src/controllers/productController.ts

import { Request, Response, NextFunction } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
} from '../models/productModel';
import {
  getOptionsByProductId,
  createOption,
  deleteOptionsByOptionsId,
} from '../models/optionModel';
import {
  getOptionValuesByOptionId,
  deleteOptionValuesByOptionId,
  createOptionValue,
} from '../models/optionValueModel';
import {
  getVariantsByProductId,
  createVariant,
  deleteVariantById,
} from '../models/variantModel';
import {
  getVariantValuesByVariantId,
  deleteVariantValuesByVariantId,
  createVariantValue,
} from '../models/variantValueModel';
import { ApiError } from '../utils/ApiError';
import { generateSlug } from '../utils/generateSlug';
import { generateSku } from '../utils/generateSku';
import { deleteImageByUrl } from '../utils/deleteImageByUrl';
import { getCategoryById } from '../models/categoryModel';

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id, name, description, is_active } = req.body;

    const isActiveBool = !!is_active;

    if (!category_id || !name || !description) {
      throw new ApiError('Missing required product fields', 400);
    }

    const cleanedName = name.trim();
    if (!cleanedName) {
      throw new ApiError('Invalid product name', 400);
    }

    const category = await getCategoryById(category_id);
    if (!category) {
      throw new ApiError('Category not found.', 400);
    }

    const slugToUse = await generateSlug(cleanedName, 'products');

    const product = await createProduct(
      category_id,
      cleanedName,
      slugToUse,
      description,
      isActiveBool
    );

    res.status(200).json({ message: 'Product Created Successfully', product });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = {
      sort: req.query.sort as string | undefined,
      availability: req.query.availability as string | undefined,
      priceRange: req.query.priceRange as string | undefined,
    };

    const products = await getProducts(filters);
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError('Invalid product ID', 400);

    const product = await getProductById(id);
    if (!product) throw new ApiError('Product not found', 404);

    // load raw options & values
    const options = await getOptionsByProductId(id);
    for (const opt of options) {
      //  fetch values per option if needed
      opt.values = await getOptionValuesByOptionId(opt.id);
    }

    // load raw variants & their values
    const variants = await getVariantsByProductId(id);
    for (const v of variants) {
      v.options = await getVariantValuesByVariantId(v.id);
    }

    res.status(200).json({ product, options, variants });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      throw new ApiError('Missing product slug', 400);
    }

    const product = await getProductBySlug(slug);

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};
export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, is_active } = req.body;

    if (!name || !category_id || !description) {
      throw new ApiError('Required fields are missing.', 400);
    }

    const product = await getProductById(Number(id));
    if (!product) {
      throw new ApiError('Product not found.', 404);
    }

    const updatedSlug = await generateSlug(name, 'products');

    // Update base product data
    await updateProduct(Number(id), {
      category_id,
      name,
      slug: updatedSlug,
      description,
      is_active,
    });

    res.status(200).json({
      status: 200,
      message: 'Product updated successfully.',
      updated: {
        id: Number(id),
        name,
        slug: updatedSlug,
        description,
        category_id,
        is_active,
      },
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
    const id = Number(req.params.id);
    if (isNaN(id)) throw new ApiError('Invalid product ID', 400);

    const existing = await getProductById(id);
    if (!existing) throw new ApiError('Product not found', 404);

    const variants = await getVariantsByProductId(id);

    // Delete each variant image from Cloudinary
    for (const variant of variants) {
      const url = variant.image_url;
      if (url && url.includes('res.cloudinary.com')) {
        await deleteImageByUrl(url);
      }
    }

    // Then delete the product
    await deleteProduct(id);

    res.status(200).json({
      message: 'Product and associated images deleted',
      deleted: {
        id: existing.id,
        name: existing.name,
        slug: existing.slug,
        category_id: existing.category_id,
      },
    });
  } catch (err) {
    next(err);
  }
};
