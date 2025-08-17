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

export async function markOrderPaidAndSaveDetails(
  orderId: number,
  {
    stripe_session_id,
    stripe_payment_intent_id,
    payment_details,
  }: {
    stripe_session_id: string | null;
    stripe_payment_intent_id: string | null;
    payment_details: any | null;
  }
) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `UPDATE orders 
       SET payment_status = 'paid',
           order_status = 'processing',
           stripe_session_id = ?,
           stripe_payment_intent_id = ?,
           payment_details = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        stripe_session_id,
        stripe_payment_intent_id,
        payment_details ? JSON.stringify(payment_details) : null,
        orderId,
      ]
    );
  } finally {
    connection.release();
  }
}

export async function markOrderFailed(orderId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      `UPDATE orders 
       SET payment_status = 'failed', 
           order_status = 'cancelled', 
           updated_at = NOW() 
       WHERE id = ?`,
      [orderId]
    );
  } finally {
    connection.release();
  }
}

export async function updateOrderStripeIds(
  orderId: number,
  stripeSessionId: string | null,
  stripePaymentIntentId: string | null
) {
  const conn = await pool.getConnection();
  try {
    await conn.execute(
      `UPDATE orders SET stripe_session_id = ?, stripe_payment_intent_id = ?, updated_at = NOW() WHERE id = ?`,
      [stripeSessionId, stripePaymentIntentId, orderId]
    );
  } finally {
    conn.release();
  }
}

export async function updateOrderPaymentDetails(orderId: number, details: any) {
  const conn = await pool.getConnection();
  try {
    await conn.execute(
      `UPDATE orders SET payment_details = ?, updated_at = NOW() WHERE id = ?`,
      [details ? JSON.stringify(details) : null, orderId]
    );
  } finally {
    conn.release();
  }
}

export async function getOrderByStripeSession(
  stripeSessionId: string
): Promise<{ id: number } | null> {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id FROM orders WHERE stripe_session_id = ? LIMIT 1`,
      [stripeSessionId]
    );
    const result = (rows as any[])[0];
    return result ? { id: result.id } : null;
  } finally {
    conn.release();
  }
}
