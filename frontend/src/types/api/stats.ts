export interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  cancelledOrders: number;
  refundRequests: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export interface RefundRequest {
  orderId: number;
  customer: string;
  amount: number;
  status: string;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
}
