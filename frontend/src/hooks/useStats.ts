import { useQuery } from "@tanstack/react-query";

import type {
  DashboardStats,
  MonthlySales,
  RefundRequest,
  LowStockProduct,
} from "@/types/api/stats";
import {
  getDashboardStats,
  getMonthlySales,
  getRefundRequests,
  getLowStockProducts,
} from "@/api/statsApi";

// Dashboard Stats
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
};

// Monthly Sales
export const useMonthlySales = () => {
  return useQuery<MonthlySales[]>({
    queryKey: ["monthly-sales"],
    queryFn: getMonthlySales,
  });
};

// Refund Requests
export const useRefundRequests = () => {
  return useQuery<RefundRequest[]>({
    queryKey: ["refund-requests"],
    queryFn: getRefundRequests,
  });
};

// Low Stock Products (with param)
export const useLowStockProducts = (threshold: number = 5) => {
  return useQuery<LowStockProduct[]>({
    queryKey: ["low-stock-products", threshold],
    queryFn: () => getLowStockProducts(threshold),
  });
};
