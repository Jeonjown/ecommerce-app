import { Request, Response, NextFunction } from 'express';
import {
  createVariant,
  deleteVariantById,
  getVariantById,
  getVariantOptionsByVariantId,
  getVariantsByProductId,
  updateVariant,
} from '../models/variantModel';
import { ApiError } from '../utils/ApiError';
import { generateSku } from '../utils/generateSku';
import { getProductById } from '../models/productModel';
import {
  createVariantValues,
  deleteVariantValuesByVariantId,
} from '../models/variantValueModel';
import { getOptionNameAndValue } from '../models/optionModel';
import { deleteImageByUrl } from '../utils/deleteImageByUrl';
import { editImageByUrl } from '../utils/editImageByUrl';

export const createVariantByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { price, stock, image_url, is_active, variant_options } = req.body;
    if (!id) throw new ApiError('Product ID is required', 400);
    if (price === undefined || stock === undefined || !image_url) {
      throw new ApiError('Missing required fields', 400);
    }

    const product = await getProductById(Number(id));
    if (!product) throw new ApiError('Product not found', 404);

    type VariantOption = {
      product_option_id: number;
      product_option_value_id: number;
    };

    const options = await Promise.all(
      (variant_options as VariantOption[]).map(
        async ({ product_option_id, product_option_value_id }) => {
          const result = await getOptionNameAndValue(
            product_option_id,
            product_option_value_id
          );

          if (!result) {
            throw new Error(
              `Invalid combination: option ID ${product_option_id}, value ID ${product_option_value_id}`
            );
          }

          return result;
        }
      )
    );

    const sku = await generateSku(product.name, options);

    const variantId = await createVariant(
      Number(id),
      sku,
      Number(price),
      Number(stock),
      image_url,
      is_active ?? true
    );

    const variantValues = await createVariantValues(variantId, variant_options);

    res.status(201).json({
      message: 'Variant created successfully',
      variantId,
      sku,
      variantValues,
    });
  } catch (error) {
    next(error);
  }
};

export const createVariantValuesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const variantId = Number(req.params.id);
    const { options } = req.body;

    if (!variantId || !Array.isArray(options)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    await createVariantValues(variantId, options);

    res.status(201).json({ message: 'Variant values created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getVariantsbyProductIdController = async (
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

export const getVariantByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const variant = await getVariantById(Number(id));

    if (!variant) throw new ApiError('No variant found', 400);

    res.status(200).json(variant);
  } catch (error) {
    next(error);
  }
};

export const updateVariantController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const variantId = Number(req.params.id);
    if (isNaN(variantId)) {
      throw new ApiError('Invalid variant ID', 400);
    }

    const { price, stock, image_url, is_active, variant_options } =
      req.body as {
        price: number;
        stock: number;
        image_url: string;
        is_active: boolean;
        variant_options: {
          product_option_id: number;
          product_option_value_id: number;
        }[];
      };

    if (
      price == null ||
      stock == null ||
      typeof image_url !== 'string' ||
      typeof is_active !== 'boolean' ||
      !Array.isArray(variant_options)
    ) {
      throw new ApiError('Missing or invalid required fields', 400);
    }

    const existing = await getVariantById(variantId);
    if (!existing) {
      throw new ApiError('Variant not found', 404);
    }

    // ✅ Delete old image if image_url changed
    if (existing.image_url !== image_url) {
      await deleteImageByUrl(existing.image_url);
    }

    // ✅ Validate variant option pairs
    const optionDetails = await Promise.all(
      variant_options.map(
        async ({ product_option_id, product_option_value_id }) => {
          const detail = await getOptionNameAndValue(
            product_option_id,
            product_option_value_id
          );
          if (!detail) {
            throw new ApiError(
              `Invalid option/value pair: option ${product_option_id}, value ${product_option_value_id}`,
              400
            );
          }
          return detail;
        }
      )
    );

    // ✅ Generate new SKU
    const newSku = await generateSku(existing.sku.split('-')[0], optionDetails);

    // ✅ Update variant
    const updated = await updateVariant(
      variantId,
      newSku,
      price,
      stock,
      image_url,
      is_active
    );

    if (!updated) {
      throw new ApiError('Failed to update variant', 500);
    }

    // ✅ Replace variant option values
    await deleteVariantValuesByVariantId(variantId);
    await createVariantValues(variantId, variant_options);

    res.status(200).json({
      message: 'Variant updated successfully',
      variantId,
      sku: newSku,
    });
  } catch (err) {
    next(err);
  }
};

export const getVariantOptionsByVariantIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const variantId = parseInt(id);

    if (isNaN(variantId)) {
      throw new ApiError('Variant ID is required', 400);
    }

    const options = await getVariantOptionsByVariantId(variantId);
    res.json(options);
  } catch (error) {
    next(error);
  }
};

export const deleteVariantByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError('Variant ID is required', 400);

    const variant = await getVariantById(Number(id));

    if (variant.image_url.includes('res.cloudinary.com')) {
      await deleteImageByUrl(variant.image_url);
    }

    await deleteVariantById(Number(id));

    res.status(200).json({ message: 'Variant deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
