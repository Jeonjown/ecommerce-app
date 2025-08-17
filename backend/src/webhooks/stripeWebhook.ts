import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../config/stripe';
import webhookHandlers from '../webhooks';

const router = express.Router();

router.post(
  '/',
  express.raw({ type: 'application/json' }),
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
      console.error('❌ Webhook signature verification failed:', err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    const handler = webhookHandlers[event.type];
    if (handler) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`❌ Error handling event ${event.type}:`, err);
        res.status(500).send('Webhook handler failed');
        return;
      }
    } else {
      console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.status(200).send('Received');
  }
);

export default router;
