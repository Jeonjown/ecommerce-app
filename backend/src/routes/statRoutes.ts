import express from 'express';
import {
  getDashboardStatsController,
  getMonthlySalesController,
  getRefundRequestsController,
  getLowStockProductsController,
} from '../controllers/statsController';

const router = express.Router();

router.get('/', getDashboardStatsController);
router.get('/monthly-sales', getMonthlySalesController);
router.get('/refund-requests', getRefundRequestsController);
router.get('/low-stock', getLowStockProductsController);

export default router;
