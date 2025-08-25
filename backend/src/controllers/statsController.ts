import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import {
  getDashboardStats,
  getMonthlySales,
  getRefundRequests,
  getLowStockProducts,
} from '../models/statModel';

// Dashboard statistics
export const getDashboardStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

// Monthly sales for the last 6 months
export const getMonthlySalesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sales = await getMonthlySales();
    res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
};

// Recent refund requests
export const getRefundRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refunds = await getRefundRequests();
    res.status(200).json(refunds);
  } catch (error) {
    next(error);
  }
};

// Low stock products (default threshold = 5, can override via query param)
export const getLowStockProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const threshold = req.query.threshold ? Number(req.query.threshold) : 5;

    if (isNaN(threshold) || threshold < 0) {
      throw new ApiError('Invalid threshold value', 400);
    }

    const products = await getLowStockProducts(threshold);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
