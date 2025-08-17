import Stripe from 'stripe';
import { markOrderPaid } from '../../models/orderModel';
import { clearCartItem } from '../../models/cartModel';

export default async function checkoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (orderId && userId) {
    console.log(`✅ Marking order ${orderId} as paid`);
    await markOrderPaid(Number(orderId));
    await clearCartItem(Number(userId));
  } else {
    console.warn('⚠️ checkout.session.completed missing metadata');
  }
}
