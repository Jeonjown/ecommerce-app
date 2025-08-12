import { ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { type OrderItem } from '../types/models/orderItems';

export const createOrderItems = async (
  order_id: number,
  items: Omit<OrderItem, 'id' | 'order_id'>[],
  connection: PoolConnection
): Promise<void> => {
  if (!items.length) return;

  const values = items.map((item) => [
    order_id,
    item.product_id,
    item.variant_id,
    item.quantity,
    item.unit_price,
  ]);

  await connection.query<ResultSetHeader>(
    `INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price) VALUES ?`,
    [values]
  );
};
