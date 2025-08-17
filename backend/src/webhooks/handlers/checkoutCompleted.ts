import Stripe from 'stripe';
import { stripe } from '../../config/stripe';
import { markOrderPaidAndSaveDetails } from '../../models/orderModel';
import { clearCartItem } from '../../models/cartModel';

export default async function checkoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (!orderId || !userId) {
    console.warn('checkout.session.completed missing metadata', {
      sessionId: session.id,
      metadata: session.metadata,
    });
    return;
  }

  if (session.payment_intent) {
    // expand charges so charge data is included
    const piResponse = await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      {
        expand: ['charges', 'charges.data.payment_method_details.card'],
      }
    );

    // cast safely: Response<PaymentIntent> -> unknown -> PaymentIntent & { charges: ApiList<Charge> }
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

    await markOrderPaidAndSaveDetails(Number(orderId), {
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntent.id,
      payment_details: details,
    });
  } else {
    await markOrderPaidAndSaveDetails(Number(orderId), {
      stripe_session_id: session.id,
      stripe_payment_intent_id: null,
      payment_details: null,
    });
  }

  await clearCartItem(Number(userId));
}
