import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { deductVariantStock } from '../models/variantModel';
import { prepareOrderData } from '../utils/orderHelpers';
import { User } from '../types/models/user';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByIdForAdmin,
  getOrdersByUserId,
  insertOrderReason,
  updateOrderStatuses,
} from '../models/orderModel';
import { createOrderItems } from '../models/orderItemModel';
import pool from '../db';
import { stripe } from '../config/stripe';
import { fromCents } from '../utils/priceConverter';
import { mapStripeRefundStatus } from '../utils/mapStripeRefundStatus';
import { processRefund } from '../services/refundService';

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

export const getOrderByIdForAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError('Invalid order id', 400);
    }

    const order = await getOrderByIdForAdmin(id);

    if (!order) {
      throw new ApiError('Order not found', 404);
    }

    res.status(200).json(order);
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

export const requestCancelOrderController = async (
  req: Request,
  res: Response
) => {
  const { user } = req as Request & { user: User };
  const { id } = req.params;
  const { reason } = req.body;

  if (!id) throw new ApiError('Order ID is required', 400);
  if (!reason) throw new ApiError('Cancellation reason is required', 400);

  const conn = await pool.getConnection();
  try {
    const order = await getOrderById(user.id, +id);
    if (!order) throw new ApiError('Order not found', 404);

    if (order.refund_status !== 'none') {
      throw new ApiError(
        'A refund/cancellation request already exists for this order',
        400
      );
    }

    if (order.payment_method === 'cod') {
      if (!['pending', 'processing'].includes(order.order_status)) {
        throw new ApiError(
          'COD orders can only be cancelled if pending or processing',
          400
        );
      }

      // Cancel COD immediately
      await updateOrderStatuses(
        Number(id),
        { order_status: 'cancelled', refund_status: 'completed' },
        conn
      );
      await insertOrderReason(Number(id), reason);
      res.status(200).json({
        message: 'Order cancelled successfully',
        orderId: id,
        reason,
      });
      return;
    }

    // Online orders
    if (order.payment_method === 'online') {
      if (
        order.payment_status !== 'paid' ||
        !['pending', 'processing', 'shipped', 'delivered'].includes(
          order.order_status
        )
      ) {
        throw new ApiError(
          'Online orders can only request refund if paid and not cancelled',
          400
        );
      }

      await updateOrderStatuses(
        Number(id),
        { refund_status: 'requested' },
        conn
      );
      await insertOrderReason(Number(id), reason);
      res.status(200).json({
        message: 'Refund request submitted',
        orderId: id,
        reason,
      });
    }
    return;
  } finally {
    conn.release();
  }
};

export const cancelOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) throw new ApiError('Order ID is required', 400);

  const conn = await pool.getConnection();
  try {
    const order = await getOrderByIdForAdmin(Number(id));
    if (!order) throw new ApiError('Order not found', 404);

    if (order.payment_method !== 'online') {
      throw new ApiError(
        'Only online payment orders can be cancelled here',
        400
      );
    }

    if (order.payment_status !== 'paid') {
      throw new ApiError('Order must be paid before cancellation/refund', 400);
    }

    if (!['pending', 'processing'].includes(order.order_status)) {
      throw new ApiError(
        'Only pending or processing orders can be cancelled',
        400
      );
    }

    const refund = await processRefund(
      order.stripe_payment_intent_id,
      order.payment_details
    );

    await updateOrderStatuses(
      Number(id),
      {
        payment_status: 'refunded',
        order_status: 'cancelled',
        refund_status: mapStripeRefundStatus(refund.status),
      },
      conn
    );

    res.status(200).json({
      message: 'Order cancelled and refund initiated',
      orderId: id,
      refund,
    });
  } finally {
    conn.release();
  }
};
