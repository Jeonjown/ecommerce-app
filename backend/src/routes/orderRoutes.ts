import express from 'express';
import {
  cancelOrderController,
  createCodOrderController,
  createStripeCheckoutSessionController,
  getAllOrdersController,
  getOrderByIdController,
  getOrderByIdForAdminController,
  getOrdersByUserIdController,
  requestCancelOrderController,
  updateOrderStatusesController,
} from '../controllers/orderController';

const router = express.Router();

router.post('/cod', createCodOrderController);
router.post('/stripe', createStripeCheckoutSessionController);

router.get('/', getAllOrdersController);
router.get('/me', getOrdersByUserIdController);
router.get('/:id', getOrderByIdController);
router.get('/admin/:id', getOrderByIdForAdminController);

router.patch('/:id/status', updateOrderStatusesController);

router.post('/:id/request-cancel', requestCancelOrderController);

router.post('/:id/cancel', cancelOrderController);

export default router;
