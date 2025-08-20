import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { deductVariantStock } from '../models/variantModel';
import { prepareOrderData } from '../utils/orderHelpers';
import { User } from '../types/models/user';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatuses,
  updateOrderStripeIds,
} from '../models/orderModel';
import { createOrderItems } from '../models/orderItemModel';
import pool from '../db';
import { stripe } from '../config/stripe';
import { fromCents } from '../utils/priceConverter';

export const createCodOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const connection = await pool.getConnection();
  try {
    const { user } = req as Request & { user: User };
    const { deliveryAddress, paymentMethod, items } = req.body;

    if (!deliveryAddress || !paymentMethod || !items?.length) {
      throw new ApiError(
        'Delivery address, payment method, and items are required',
        400
      );
    }

    if (paymentMethod.toLowerCase() !== 'cod') {
      throw new ApiError('Invalid payment method for COD endpoint', 400);
    }

    await connection.beginTransaction();

    // 1. Validate stock & get order items with prices
    const { totalPrice, orderItems } = await prepareOrderData(items);

    // 2. Create order in DB with COD specifics
    const orderId = await createOrder(
      user.id,
      paymentMethod,
      totalPrice,
      'pending',
      deliveryAddress,
      connection,
      'unpaid'
    );

    // 3. Create order items
    await createOrderItems(orderId, orderItems, connection);

    // 4. Deduct stock immediately (optional for COD)
    for (const item of orderItems) {
      const updated = await deductVariantStock(
        item.variant_id,
        item.quantity,
        connection
      );
      if (!updated) {
        throw new ApiError(
          `Insufficient stock for variant ${item.variant_id}`,
          400
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      message: 'COD Order Created Successfully',
      orderId,
      totalPrice: fromCents(totalPrice),
      items: orderItems.map((item) => ({
        ...item,
        unit_price: fromCents(item.unit_price),
      })),
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const createStripeCheckoutSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };
    const { deliveryAddress, items } = req.body;

    if (!deliveryAddress || !items?.length) {
      throw new ApiError('Missing required fields', 400);
    }

    const { orderItems } = await prepareOrderData(items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: 'php',
          product_data: { name: item.name },
          unit_amount: item.unit_price, // in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: user.id.toString(),
        deliveryAddress,
        items: JSON.stringify(orderItems), // snapshot for webhook
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };
    if (!user) {
      throw new ApiError('Not Authorized', 401);
    }

    const orders = await getOrdersByUserId(user.id);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: User };
    const { id } = req.params;

    if (!user) {
      throw new ApiError('Not Authorized', 401);
    }

    if (!id) {
      throw new ApiError('Order ID is required', 400);
    }

    const order = await getOrderById(user.id, Number(id));

    if (!order) {
      throw new ApiError('Order not found', 404);
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await getAllOrders();

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusesController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { payment_status, order_status, refund_status } = req.body;

  if (!id) {
    throw new ApiError('Order ID is required', 400);
  }

  await updateOrderStatuses(Number(id), {
    payment_status,
    order_status,
    refund_status,
  });

  res.json({ message: 'Order status updated successfully' });
};
