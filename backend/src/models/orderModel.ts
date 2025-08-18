import { ResultSetHeader, PoolConnection, RowDataPacket } from 'mysql2/promise';
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

export const getOrdersByUserId = async (userId: number) => {
  const [rows] = await pool.query(
    `SELECT 
     o.id AS order_id,
     o.user_id,
     o.payment_method,
     o.payment_status,
     o.order_status,
     o.refund_status,
     o.total_price AS order_total,
     o.delivery_address,
     o.created_at,  -- add this
     oi.id AS order_item_id,
     oi.product_id,
     oi.variant_id,
     oi.quantity,
     oi.unit_price,
     p.name AS product_name,
     p.brand AS product_brand,
     pv.name AS variant_name,
     pv.sku AS variant_sku,
     pv.price AS variant_price,
     pv.image_url AS variant_image
   FROM orders o
   JOIN order_items oi ON o.id = oi.order_id
   JOIN products p ON oi.product_id = p.id
   JOIN product_variants pv ON oi.variant_id = pv.id
   WHERE o.user_id = ?
   ORDER BY o.created_at DESC`,
    [userId]
  );

  return rows;
};
