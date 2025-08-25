import { isAxiosError } from "axios";
import api from "./axios";
import type {
  DashboardStats,
  MonthlySales,
  RefundRequest,
  LowStockProduct,
} from "@/types/api/stats";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const res = await api.get("/stats", { withCredentials: true });
    return res.data as DashboardStats;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard stats.",
      );
    }
    throw new Error("Unexpected error fetching dashboard stats.");
  }
};

export const getMonthlySales = async (): Promise<MonthlySales[]> => {
  try {
    const res = await api.get("/stats/monthly-sales", {
      withCredentials: true,
    });
    return res.data as MonthlySales[];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch monthly sales.",
      );
    }
    throw new Error("Unexpected error fetching monthly sales.");
  }
};

export const getRefundRequests = async (): Promise<RefundRequest[]> => {
  try {
    const res = await api.get("/stats/refund-requests", {
      withCredentials: true,
    });
    return res.data as RefundRequest[];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch refund requests.",
      );
    }
    throw new Error("Unexpected error fetching refund requests.");
  }
};

export const getLowStockProducts = async (
  threshold: number = 5,
): Promise<LowStockProduct[]> => {
  try {
    const res = await api.get(`/stats/low-stock?threshold=${threshold}`, {
      withCredentials: true,
    });
    return res.data as LowStockProduct[];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch low stock products.",
      );
    }
    throw new Error("Unexpected error fetching low stock products.");
  }
};
