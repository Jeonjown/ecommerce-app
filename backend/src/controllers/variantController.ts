import { Request, Response, NextFunction } from 'express';
import {
  createVariant,
  deleteVariantById,
  getVariantOptionsByVariantId,
  getVariantsByProductId,
} from '../models/variantModel';
import { ApiError } from '../utils/ApiError';
import { generateSku } from '../utils/generateSku';
import { getProductById } from '../models/productModel';
import { createVariantValues } from '../models/variantValueModel';
import { getOptionNameAndValue } from '../models/optionModel';

export const getVariantbyIdController = async (
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

    await deleteVariantById(Number(id));

    res.status(200).json({ message: 'Variant deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const createVariantByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { price, stock, image_url, is_active, variant_options } = req.body;
    console.log(variant_options);
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
    console.log(options);
    console.log('Generating SKU with:', product.name, options);

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
