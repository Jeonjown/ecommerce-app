import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import {
  addItemtoCart,
  clearCartItem,
  getCartItemsByLoggedUser,
  removeCartItem,
  syncUserCart,
  updateCartItem,
} from '../models/cartModel';
import { User } from '../types/models/user';

export const syncUserCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };

    const cartItems = req.body;

    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }

    await syncUserCart(user.id, cartItems);
    res.status(200).json({ message: 'Cart synced successfully' });
  } catch (error) {
    next(error);
  }
};

export const getCartItemsByLoggedUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };

    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }

    const result = await getCartItemsByLoggedUser(user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const addItemtoCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };
    const cartItem = req.body;

    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }

    if (!cartItem || !cartItem.variant_id || !cartItem.quantity) {
      throw new ApiError('Invalid cart item data', 400);
    }

    const result = await addItemtoCart(user.id, cartItem);
    res.status(201).json({ message: 'Item added to cart', result });
  } catch (error) {
    next(error);
  }
};

export const removeItemFromCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };
    const { variant_id } = req.params;

    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }

    const variantIdNum = Number(variant_id);

    if (!variant_id || isNaN(variantIdNum)) {
      throw new ApiError('Invalid or missing variant_id', 400);
    }

    const result = await removeCartItem(user.id, variantIdNum);

    if (result === 0) {
      throw new ApiError('Cart item not found', 404);
    }

    res.status(200).json({ message: 'Item removed from cart', result });
  } catch (error) {
    next(error);
  }
};

export const updateItemFromCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };
    const cartItem = req.body;

    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }

    const { variant_id, quantity } = cartItem;

    if (!variant_id || typeof quantity !== 'number' || quantity < 1) {
      throw new ApiError('Invalid cart item data', 400);
    }

    const result = await updateCartItem(user.id, cartItem);

    if (result.affectedRows === 0) {
      throw new ApiError('Cart item not found or unchanged', 404);
    }

    res.status(200).json({ message: 'Cart item updated', result });
  } catch (error) {
    next(error);
  }
};

export const clearCartItemsFromCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };

    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }

    const affectedRows = await clearCartItem(user.id);

    if (affectedRows === 0) {
      throw new ApiError('No cart items found for this user', 404);
    }

    res.status(200).json({
      message: 'Cart cleared successfully',
      cleared: affectedRows,
    });
  } catch (error) {
    next(error);
  }
};
