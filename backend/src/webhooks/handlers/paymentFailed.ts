import Stripe from 'stripe';
import { stripe } from '../../config/stripe';
import {
  markOrderFailed,
  updateOrderPaymentDetails,
  updateOrderStripeIds,
} from '../../models/orderModel';
import pool from '../../db';

export default async function paymentFailed(event: Stripe.Event) {
  const intent = event.data.object as Stripe.PaymentIntent;
  const orderId = intent.metadata?.orderId;

  if (!orderId) {
    console.warn('payment_intent.payment_failed missing metadata', {
      intentId: intent.id,
    });
    return;
  }

  const details = {
    id: intent.id,
    status: intent.status,
    last_payment_error: intent.last_payment_error
      ? {
          code: intent.last_payment_error.code,
          message: intent.last_payment_error.message,
        }
      : null,
  };

  // Optionally update stripe ids & details
  await updateOrderStripeIds(Number(orderId), null, intent.id);
  await updateOrderPaymentDetails(Number(orderId), details);

  await markOrderFailed(Number(orderId));
}
