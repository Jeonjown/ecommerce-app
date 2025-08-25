import { RowDataPacket } from 'mysql2/promise';
import pool from '../db';

export const getDashboardStats = async () => {
  const [[orderStats]] = await pool.query<RowDataPacket[]>(`
    SELECT 
      COUNT(*) AS totalOrders,
      COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END),0) AS totalSales,
      SUM(order_status = 'pending') AS pendingOrders,
      SUM(order_status = 'cancelled') AS cancelledOrders,
      SUM(refund_status IN ('requested','processing')) AS refundRequests
    FROM orders
  `);

  return {
    totalOrders: orderStats.totalOrders,
    totalSales: Number(orderStats.totalSales) / 100, // convert cents → pesos
    pendingOrders: orderStats.pendingOrders,
    cancelledOrders: orderStats.cancelledOrders,
    refundRequests: orderStats.refundRequests,
  };
};

export const getMonthlySales = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    WITH RECURSIVE last_months AS (
      SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01') AS month_start
      UNION ALL
      SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
      FROM last_months
      WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    )
    SELECT 
      DATE_FORMAT(lm.month_start, '%b') AS month,
      COALESCE(SUM(o.total_price), 0) / 100 AS sales
    FROM last_months lm
    LEFT JOIN orders o 
      ON YEAR(o.created_at) = YEAR(lm.month_start)
     AND MONTH(o.created_at) = MONTH(lm.month_start)
     AND o.payment_status = 'paid'
    GROUP BY lm.month_start
    ORDER BY lm.month_start;
  `);

  return rows;
};
export const getMonthlyOrderStatuses = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      DATE_FORMAT(MIN(created_at), '%b') AS month,
      COUNT(*) AS totalOrders,
      SUM(order_status = 'pending') AS pendingOrders,
      SUM(order_status = 'cancelled') AS cancelledOrders,
      SUM(refund_status IN ('requested','processing')) AS refundRequests
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY YEAR(created_at), MONTH(created_at)
    ORDER BY YEAR(created_at), MONTH(created_at);
  `);

  return rows;
};

export const getRefundRequests = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      o.id AS orderId,
      u.name AS customer,
      o.total_price / 100 AS amount,
      o.refund_status AS status
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.refund_status IN ('requested','processing')
    ORDER BY o.created_at DESC
    LIMIT 10
  `);

  return rows;
};

export const getLowStockProducts = async (threshold: number = 5) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      pv.id,
      pv.name,
      pv.stock,
      pv.price / 100 AS price
    FROM product_variants pv
    WHERE pv.stock <= ?
    ORDER BY pv.stock ASC
    LIMIT 20
  `,
    [threshold]
  );

  return rows;
};
