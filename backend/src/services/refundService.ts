import Stripe from 'stripe';
import { ApiError } from '../utils/ApiError';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function processRefund(
  stripePaymentIntentId?: string | null,
  paymentDetails?: string | null
) {
  let paymentIntentId = stripePaymentIntentId;

  if (!paymentIntentId && paymentDetails) {
    try {
      const details = JSON.parse(paymentDetails);
      paymentIntentId = details.id;
    } catch {
      throw new ApiError('Invalid payment details JSON', 500);
    }
  }

  if (!paymentIntentId) {
    throw new ApiError('Payment intent ID missing for refund', 400);
  }

  return stripe.refunds.create({ payment_intent: paymentIntentId });
}
