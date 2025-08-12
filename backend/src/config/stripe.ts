import Stripe from 'stripe';
import { ApiError } from '../utils/ApiError';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new ApiError('Missing STRIPE_SECRET_KEY in env', 500);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});
