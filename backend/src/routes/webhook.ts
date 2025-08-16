// routes/webhook.ts
import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import { stripe } from '../config/stripe';
import { markOrderPaid } from '../models/orderModel';
import { clearCartItem } from '../models/cartModel';

const router = express.Router();

router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      console.log('✅ Webhook triggered. Metadata:', session.metadata);

      if (orderId && userId) {
        console.log(
          `🔔 Marking order ${orderId} paid and clearing cart for user ${userId}`
        );

        const mark = await markOrderPaid(Number(orderId));
        console.log('Order update result:', mark);

        const cleared = await clearCartItem(Number(userId));
        console.log(
          `🛒 Cleared cart for user ${userId}, rows deleted:`,
          cleared
        );
      } else {
        console.warn(
          '⚠️ Missing metadata. OrderId or UserId not found:',
          session.metadata
        );
      }
    }

    res.status(200).send('Received');
  }
);

export default router;
