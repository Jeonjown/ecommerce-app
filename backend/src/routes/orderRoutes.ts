import express from 'express';
import {
  createCodOrderController,
  createStripeCheckoutSessionController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByUserIdController,
  updateOrderStatusesController,
} from '../controllers/orderController';

const router = express.Router();

router.post('/cod', createCodOrderController);
router.post('/stripe', createStripeCheckoutSessionController);

router.get('/', getAllOrdersController);
router.get('/me', getOrdersByUserIdController);
router.get('/:id', getOrderByIdController);

router.patch('/:id/status', updateOrderStatusesController);

export default router;
