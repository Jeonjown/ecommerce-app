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

export const getOrderById = async (userId: number, orderId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      o.id AS order_id,
      o.user_id,
      u.name AS customer_name,
      u.email AS customer_email,

      o.payment_method,
      o.payment_status,
      o.order_status,
      o.refund_status,
      o.total_price,
      o.delivery_address,
      o.stripe_session_id,
      o.stripe_payment_intent_id,
      o.payment_details,
      o.created_at AS order_date,
      o.updated_at AS last_updated,

      -- Item details
      oi.id AS order_item_id,
      oi.quantity,
      oi.unit_price,

      -- Product details
      p.id AS product_id,
      p.name AS product_name,
      p.brand,
      pv.id AS variant_id,
      pv.sku,
      pv.name AS variant_name,
      pv.image_url,
      pv.price AS variant_price

    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN product_variants pv ON oi.variant_id = pv.id
    WHERE o.id = ? AND o.user_id = ?
    `,
    [orderId, userId]
  );

  if (rows.length === 0) return null;

  const {
    order_id,
    user_id,
    customer_name,
    customer_email,
    payment_method,
    payment_status,
    order_status,
    refund_status,
    total_price,
    delivery_address,
    stripe_session_id,
    stripe_payment_intent_id,
    payment_details,
    order_date,
    last_updated,
  } = rows[0];

  const items = rows.map((row) => ({
    order_item_id: row.order_item_id,
    quantity: row.quantity,
    unit_price: row.unit_price,
    product_id: row.product_id,
    product_name: row.product_name,
    brand: row.brand,
    variant_id: row.variant_id,
    sku: row.sku,
    variant_name: row.variant_name,
    image_url: row.image_url,
    variant_price: row.variant_price,
  }));

  return {
    order_id,
    user_id,
    customer_name,
    customer_email,
    payment_method,
    payment_status,
    order_status,
    refund_status,
    total_price,
    delivery_address,
    stripe_session_id,
    stripe_payment_intent_id,
    payment_details,
    order_date,
    last_updated,
    items,
  };
};

export const getOrderByIdForAdmin = async (orderId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      o.id AS order_id,
      o.user_id,
      u.name AS customer_name,
      u.email AS customer_email,

      o.payment_method,
      o.payment_status,
      o.order_status,
      o.refund_status,
      o.total_price,
      o.delivery_address,
      o.stripe_session_id,
      o.stripe_payment_intent_id,
      o.payment_details,
      o.created_at AS order_date,
      o.updated_at AS last_updated,

      -- Item details
      oi.id AS order_item_id,
      oi.quantity,
      oi.unit_price,

      -- Product details
      p.id AS product_id,
      p.name AS product_name,
      p.brand,
      pv.id AS variant_id,
      pv.sku,
      pv.name AS variant_name,
      pv.image_url,
      pv.price AS variant_price

    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN product_variants pv ON oi.variant_id = pv.id
    WHERE o.id = ?
    `,
    [orderId]
  );

  return rows[0] || null;
};

export const getAllOrders = async () => {
  const [rows] = await pool.query(
    `SELECT 
      o.id AS order_id,
      o.user_id,
      o.payment_method,
      o.payment_status,
      o.order_status,
      o.refund_status,
      o.cancellation_reason,
      o.total_price AS order_total,
      o.delivery_address,
      o.created_at,
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
    ORDER BY o.created_at DESC`
  );

  return rows;
};

export async function updateOrderStatuses(
  orderId: number,
  {
    payment_status,
    order_status,
    refund_status,
  }: {
    payment_status?: string;
    order_status?: string;
    refund_status?: string;
  },
  connection?: PoolConnection
) {
  const conn = connection ?? (await pool.getConnection());
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (payment_status !== undefined) {
      fields.push('payment_status = ?');
      values.push(payment_status);
    }
    if (order_status !== undefined) {
      fields.push('order_status = ?');
      values.push(order_status);
    }
    if (refund_status !== undefined) {
      fields.push('refund_status = ?');
      values.push(refund_status);
    }

    if (fields.length === 0) {
      return; // nothing to update
    }

    values.push(orderId);

    await conn.execute(
      `UPDATE orders SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
  } finally {
    if (!connection) conn.release();
  }
}

export async function insertOrderReason(orderId: number, reason: string) {
  const [result] = await pool.query<ResultSetHeader>(
    `
    UPDATE orders
    SET cancellation_reason = ?
    WHERE id = ?
    `,
    [reason, orderId]
  );

  return result.affectedRows > 0;
}
