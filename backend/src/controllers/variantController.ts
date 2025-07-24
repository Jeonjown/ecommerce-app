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
    const { price, stock, image_url, is_active, options } = req.body;

    if (!id) throw new ApiError('Product ID is required', 400);
    if (price === undefined || stock === undefined || !image_url) {
      throw new ApiError('Missing required fields', 400);
    }

    // Optional: get product name from DB based on ID
    const product = await getProductById(Number(id));
    if (!product) throw new ApiError('Product not found', 404);

    // Generate a unique SKU
    const sku = await generateSku(product.name, options);

    const variantId = await createVariant(
      Number(id),
      sku,
      Number(price),
      Number(stock),
      image_url,
      is_active ?? true
    );

    res
      .status(201)
      .json({ message: 'Variant created successfully', variantId, sku });
  } catch (error) {
    next(error);
  }
};
