import express from 'express';
import {
  cancelOrderController,
  createCodOrderController,
  createStripeCheckoutSessionController,
  getAllOrdersController,
  getOrderByIdController,
  getOrderByIdForAdminController,
  getOrdersByLoggedInUserController,
  getOrdersByUserIdController,
  requestCancelOrderController,
  updateOrderStatusesController,
} from '../controllers/orderController';

const router = express.Router();

router.post('/cod', createCodOrderController);
router.post('/stripe', createStripeCheckoutSessionController);

router.get('/me', getOrdersByLoggedInUserController);
router.get('/admin/:id', getOrderByIdForAdminController);
router.get('/admin/user/:id', getOrdersByUserIdController);

router.get('/:id', getOrderByIdController);
router.get('/', getAllOrdersController);

router.patch('/:id/status', updateOrderStatusesController);

router.post('/:id/request-cancel', requestCancelOrderController);

router.post('/:id/cancel', cancelOrderController);

export default router;
