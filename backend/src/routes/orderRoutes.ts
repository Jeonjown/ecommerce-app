import express from 'express';
import {
  createCodOrderController,
  createStripeCheckoutSessionController,
} from '../controllers/orderController';

const router = express.Router();

// POST	/orders	Create a new order

router.post('/cod', createCodOrderController);
router.post('/stripe', createStripeCheckoutSessionController);

// GET	/orders	List all orders (for admin or user)
// GET	/orders/:id	Get details of a specific order
// PUT/PATCH	/orders/:id	Update order (e.g., status, payment)
// DELETE	/orders/:id	Cancel or delete an order

export default router;
