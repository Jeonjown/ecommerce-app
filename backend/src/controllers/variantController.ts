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
    const {
      price,
      stock,
      image_url,
      is_active,
      variant_options,
      name,
      description,
    } = req.body;
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
      is_active ?? true,
      name,
      description
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

    const {
      price,
      stock,
      image_url,
      is_active,
      variant_options,
      name,
      description,
      sku,
      product_id,
    } = req.body as {
      price?: number;
      stock?: number;
      image_url?: string | null;
      is_active?: boolean;
      variant_options?: {
        product_option_id: number;
        product_option_value_id: number;
      }[];
      name?: string;
      description?: string;
      sku?: string;
      product_id?: number;
    };

    // optional: ensure variant_options is an array if provided
    if (variant_options !== undefined && !Array.isArray(variant_options)) {
      throw new ApiError('variant_options must be an array', 400);
    }

    const existing = await getVariantById(variantId);
    if (!existing) {
      throw new ApiError('Variant not found', 404);
    }

    // If variant_options provided, validate them
    let optionDetails: any[] = [];
    if (Array.isArray(variant_options) && variant_options.length > 0) {
      optionDetails = await Promise.all(
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
    }

    // generate sku if options changed, otherwise keep provided sku or existing
    const baseSku = existing.sku?.split('-')[0] ?? sku ?? 'SKU';
    const newSku =
      optionDetails.length > 0
        ? await generateSku(baseSku, optionDetails)
        : (sku ?? existing.sku);

    // ensure image_url won't be set to empty string (use existing if empty or omitted)
    const imageToUse =
      typeof image_url === 'string' && image_url.trim() !== ''
        ? image_url
        : existing.image_url;

    // sanitize sku (allow letters, numbers, underscore, hyphen)
    const sanitizeSku = (s?: string) =>
      s ? String(s).replace(/[^\w-]/g, '-') : existing.sku;

    // Build the exact args we will pass to updateVariant (matching your model signature)
    const callArgs = {
      id: variantId,
      sku: sanitizeSku(newSku),
      price:
        price !== undefined && price !== null ? Number(price) : existing.price,
      stock:
        stock !== undefined && stock !== null ? Number(stock) : existing.stock,
      image_url: imageToUse,
      is_active:
        typeof is_active === 'boolean' ? is_active : existing.is_active,
      name: name !== undefined ? name : existing.name,
      description:
        description !== undefined ? description : existing.description,
    };

    // Call updateVariant and log DB-level errors if they occur
    try {
      const updated = await updateVariant(
        callArgs.id,
        callArgs.sku,
        callArgs.price,
        callArgs.stock,
        callArgs.image_url,
        callArgs.is_active,
        callArgs.name,
        callArgs.description
      );

      if (!updated) {
        throw new ApiError('Failed to update variant', 500);
      }
    } catch (err) {
      console.error(
        '[updateVariantController] updateVariant threw:',
        (err as any).message
      );
      console.error('[updateVariantController] err.sql:', (err as any).sql);
      console.error(
        '[updateVariantController] err.code/errno:',
        (err as any).code,
        (err as any).errno
      );
      throw err;
    }

    // Replace variant option values if provided (delete then create)
    if (Array.isArray(variant_options)) {
      await deleteVariantValuesByVariantId(variantId);
      if (variant_options.length > 0) {
        await createVariantValues(variantId, variant_options);
      }
    }

    res.status(200).json({
      message: 'Variant updated successfully',
      variantId,
      sku: callArgs.sku,
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
