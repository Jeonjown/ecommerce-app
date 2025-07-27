// src/controllers/productController.ts

import { Request, Response, NextFunction } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../models/productModel';
import { getOptionsByProductId, createOption } from '../models/optionModel';
import {
  getOptionValuesByOptionId,
  deleteOptionValuesByOptionId,
  createOptionValue,
} from '../models/optionValueModel';
import { getVariantsByProductId, createVariant } from '../models/variantModel';
import {
  getVariantValuesByVariantId,
  deleteVariantValuesByVariantId,
  createVariantValue,
} from '../models/variantValueModel';
import { ApiError } from '../utils/ApiError';
import { generateSlug } from '../utils/generateSlug';
import { generateSku } from '../utils/generateSku';

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

export const createProductControllerTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      category_id,
      name,
      description,
      is_active = true,
      options = [],
      variants = [],
      slug: incomingSlug,
    } = req.body;

    if (!category_id || !name || !description) {
      throw new ApiError('Missing required product fields', 400);
    }

    const cleanedName = name.trim();
    if (!cleanedName) {
      throw new ApiError('Invalid product name', 400);
    }

    const slugToUse =
      typeof incomingSlug === 'string' && incomingSlug.trim()
        ? incomingSlug.trim()
        : await generateSlug(cleanedName, 'products');

    if (!slugToUse) {
      throw new ApiError('Failed to generate a valid slug', 500);
    }

    const productId = await createProduct(
      category_id,
      cleanedName,
      slugToUse,
      description,
      is_active
    );

    const createdProduct = await getProductById(productId);
    res.status(201).json({
      message: 'Product created successfully',
      product: createdProduct,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProducts();
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

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      name,
      description,
      image_url,
      is_active,
      options,
      variants,
    } = req.body;

    if (!name || !category_id || !image_url || !description) {
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

    // Delete existing variants + variant values
    const existingVariants = await getVariantsByProductId(Number(id));
    for (const variant of existingVariants) {
      await deleteVariantValuesByVariantId(variant.id);
    }
    await deleteVariant(Number(id));

    // Delete existing options + option values
    const existingOptions = await getOptionsByProductId(Number(id));
    for (const option of existingOptions) {
      await deleteOptionValuesByOptionId(option.id);
    }
    await deleteOptionsByProductId(Number(id));

    // Re-create options and option values
    const optionMap = new Map<
      string,
      { optionId: number; valueMap: Map<string, number> }
    >();

    for (const option of options) {
      const optionId = await createOption(Number(id), option.name);
      const valueMap = new Map<string, number>();

      for (const val of option.values) {
        const valueId = await createOptionValue(optionId, val);
        valueMap.set(val, valueId);
      }

      optionMap.set(option.name, { optionId, valueMap });
    }

    // Re-create variants and variant values
    const createdVariants = [];

    for (const variant of variants) {
      const sku = await generateSku(name, variant.options);

      const variantId = await createVariant(
        Number(id),
        sku,
        variant.price,
        variant.stock,
        variant.image_url,
        variant.is_active ?? true
      );

      const variantOptionSummary: { name: string; value: string }[] = [];

      for (const selection of variant.options) {
        const mapping = optionMap.get(selection.name);
        if (!mapping) {
          throw new ApiError(`Option "${selection.name}" not found`, 400);
        }

        const valueId = mapping.valueMap.get(selection.value);
        if (!valueId) {
          throw new ApiError(
            `Value "${selection.value}" not found for option "${selection.name}"`,
            400
          );
        }

        await createVariantValue(variantId, mapping.optionId, valueId);

        variantOptionSummary.push({
          name: selection.name,
          value: selection.value,
        });
      }

      createdVariants.push({
        sku,
        price: variant.price,
        stock: variant.stock,
        image_url: variant.image_url,
        is_active: variant.is_active ?? true,
        options: variantOptionSummary,
      });
    }

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
        optionoptions: options.map((o: { name: string; values: string[] }) => ({
          name: o.name,
          values: o.values,
        })),
        variants: createdVariants,
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

    // cascade delete in proper order:
    await deleteVariantValuesByVariantId(id);
    await deleteVariant(id);
    await deleteOptionValuesByOptionId(id);
    await deleteOptionsByProductId(id);
    await deleteProduct(id);

    res.status(200).json({
      message: 'Product deleted',
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
