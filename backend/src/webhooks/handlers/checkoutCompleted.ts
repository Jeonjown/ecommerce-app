import Stripe from 'stripe';
import { stripe } from '../../config/stripe';
import {
  createOrder,
  getOrderByStripeSession,
  markOrderPaidAndSaveDetails,
} from '../../models/orderModel';
import { clearCartItem } from '../../models/cartModel';
import pool from '../../db';
import { createOrderItems } from '../../models/orderItemModel';
import { deductVariantStock } from '../../models/variantModel';

export default async function checkoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  const existingOrder = await getOrderByStripeSession(session.id);
  if (existingOrder) {
    console.log('Order already exists for session:', session.id);
    return; // Stop processing duplicate webhook
  }

  const userId = session.metadata?.userId;
  const deliveryAddress = session.metadata?.deliveryAddress;
  const orderItems = session.metadata?.items
    ? JSON.parse(session.metadata.items)
    : [];

  if (!userId || !deliveryAddress || !orderItems?.length) {
    console.warn('Missing metadata for creating order', session.id);
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Calculate totalPrice from metadata (or recalc)
    const totalPrice = orderItems.reduce(
      (sum: number, item: any) => sum + item.unit_price * item.quantity,
      0
    );

    // 2. Create order in DB
    const orderId = await createOrder(
      Number(userId),
      'online',
      totalPrice,
      'pending',
      deliveryAddress,
      connection,
      'paid' // already paid
    );

    await createOrderItems(orderId, orderItems, connection);

    // 3. Deduct stock
    for (const item of orderItems) {
      const updated = await deductVariantStock(
        item.variant_id,
        item.quantity,
        connection
      );
      if (!updated) {
        throw new Error(`Insufficient stock for variant ${item.variant_id}`);
      }
    }

    await connection.commit();

    // 4. Save Stripe info
    const piResponse = await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      {
        expand: ['charges', 'charges.data.payment_method_details.card'],
      }
    );

    const paymentIntent = piResponse as unknown as Stripe.PaymentIntent & {
      charges: Stripe.ApiList<Stripe.Charge>;
    };
    const charge = paymentIntent.charges?.data?.[0];

    const details = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount_received: paymentIntent.amount_received,
      currency: paymentIntent.currency,
      payment_method: paymentIntent.payment_method,
      receipt_url: charge?.receipt_url ?? null,
      card_brand: charge?.payment_method_details?.card?.brand ?? null,
      card_last4: charge?.payment_method_details?.card?.last4 ?? null,
    };

    await markOrderPaidAndSaveDetails(orderId, {
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntent.id,
      payment_details: details,
    });

    // 5. Clear cart
    await clearCartItem(Number(userId));
  } catch (err) {
    await connection.rollback();
    console.error('Webhook order creation failed', err);
  } finally {
    connection.release();
  }
}
