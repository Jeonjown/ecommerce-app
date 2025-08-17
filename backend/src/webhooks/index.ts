import Stripe from 'stripe';
import checkoutCompleted from './handlers/checkoutCompleted';
import paymentFailed from './handlers/paymentFailed';

const webhookHandlers: Record<string, (event: Stripe.Event) => Promise<void>> =
  {
    'checkout.session.completed': checkoutCompleted,
    'payment_intent.payment_failed': paymentFailed,
  };

export default webhookHandlers;
