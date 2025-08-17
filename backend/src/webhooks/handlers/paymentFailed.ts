import Stripe from 'stripe';
import { markOrderFailed } from '../../models/orderModel';

export default async function paymentFailed(event: Stripe.Event) {
  const intent = event.data.object as Stripe.PaymentIntent;
  const orderId = intent.metadata?.orderId;

  if (orderId) {
    console.log(`❌ Marking order ${orderId} as failed`);
    await markOrderFailed(Number(orderId));
  } else {
    console.warn('⚠️ payment_intent.payment_failed missing metadata');
  }
}
