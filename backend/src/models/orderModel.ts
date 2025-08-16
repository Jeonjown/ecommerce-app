import { ResultSetHeader, PoolConnection } from 'mysql2/promise';
import pool from '../db';

export const createOrder = async (
  user_id: number,
  payment_method: string,
  total_price: number,
  order_status: string,
  delivery_address: string,
  connection: PoolConnection,
  payment_status: string
): Promise<number> => {
  const [result] = await connection.query<ResultSetHeader>(
    `INSERT INTO orders (user_id, payment_method, total_price, order_status, delivery_address, payment_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      payment_method,
      total_price,
      order_status,
      delivery_address,
      payment_status,
    ]
  );

  return result.insertId;
};

export async function markOrderPaid(orderId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `UPDATE orders 
       SET payment_status = 'paid', order_status = 'processing', updated_at = NOW() 
       WHERE id = ?`,
      [orderId]
    );
  } finally {
    connection.release();
  }
}
