import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { getVariantById, getVariantsByProductId } from '../models/variantModel';
import { prepareOrderData } from '../utils/orderHelpers';

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentMethod, items } = req.body;

    if (!paymentMethod || !items?.length) {
      throw new ApiError('No payment method or items provided', 400);
    }

    const { totalPrice, preparedItems } = await prepareOrderData(items);

    console.log('Prepared Items:', preparedItems);
    console.log('Total Order Price:', totalPrice);

    // 1. Create order in orders table
    // const orderId = await createOrder({
    //   paymentMethod,
    //   totalPrice,
    // });

    // 2. Insert all items into order_items table
    // await insertOrderItems(orderId, preparedItems);

    // deduct order to stock

    res.status(201).json({
      message: 'Order Created Successfully',
      //   orderId,
      totalPrice,
      items: preparedItems,
    });
  } catch (error) {
    next(error);
  }
};
