import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { deductVariantStock } from '../models/variantModel';
import { prepareOrderData } from '../utils/orderHelpers';
import { User } from '../types/models/user';
import { createOrder, updateOrderStripeIds } from '../models/orderModel';
import { createOrderItems } from '../models/orderItemModel';
import pool from '../db';
import { stripe } from '../config/stripe';

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
      totalPrice,
      items: orderItems,
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
  const connection = await pool.getConnection();
  try {
    const { user } = req as Request & { user: User };
    const { deliveryAddress, paymentMethod, items } = req.body;

    if (!deliveryAddress || !paymentMethod || !items?.length) {
      throw new ApiError('Missing required fields', 400);
    }

    // Prepare order details
    const { totalPrice, orderItems } = await prepareOrderData(items);

    await connection.beginTransaction();

    // Create order with unpaid status
    const orderId = await createOrder(
      user.id,
      paymentMethod,
      totalPrice,
      'pending',
      deliveryAddress,
      connection,
      'unpaid'
    );

    await createOrderItems(orderId, orderItems, connection);

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

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: 'php',
          product_data: { name: item.name },
          unit_amount: Math.round(item.unit_price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success/${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/order-cancelled/${orderId}`,
      metadata: {
        orderId: orderId.toString(),
        userId: user.id.toString(),
      },
    });

    await updateOrderStripeIds(
      orderId,
      session.id,
      session.payment_intent as string | null
    );

    res.status(200).json({ url: session.url });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};
