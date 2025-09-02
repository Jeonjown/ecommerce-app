import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { CartItem } from '../types/models/cart';

export const syncUserCart = async (userId: number, cartItems: CartItem[]) => {
  for (const item of cartItems) {
    await addItemtoCart(userId, item);
  }
};

export const addItemtoCart = async (userId: number, cartItem: CartItem) => {
  const existing = await findExistingCartitem(userId, cartItem);

  if (existing.length > 0) {
    const existingQuantity = existing[0].quantity;
    const newQuantity = existingQuantity + cartItem.quantity;

    if (newQuantity > cartItem.stock) {
      throw new Error('Cannot add more than available stock.');
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE cart 
       SET 
         quantity = quantity + ?, 
         stock = ?, 
         price = ?, 
         product_name = ?, 
         name = ?, 
         image_url = ?, 
         product_id = ? 
       WHERE 
         user_id = ? AND variant_id = ?`,
      [
        cartItem.quantity,
        cartItem.stock,
        cartItem.price,
        cartItem.product_name,
        cartItem.name,
        cartItem.image_url,
        cartItem.product_id,
        userId,
        cartItem.variant_id,
      ]
    );

    return result.affectedRows;
  } else {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO cart 
        (user_id, product_id, variant_id, product_name, name, price, image_url, quantity, stock) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        cartItem.product_id,
        cartItem.variant_id,
        cartItem.product_name,
        cartItem.name,
        cartItem.price,
        cartItem.image_url,
        cartItem.quantity,
        cartItem.stock,
      ]
    );

    return result.insertId;
  }
};

export const getCartItemsByLoggedUser = async (userId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM cart WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};

export const findExistingCartitem = async (
  userId: number,
  cartItem: CartItem
) => {
  const [existingRows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM cart WHERE user_id = ? AND variant_id = ?`,
    [userId, cartItem.variant_id]
  );

  return existingRows;
};

export const updateCartItem = async (userId: number, cartItem: CartItem) => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE cart 
     SET 
       quantity = ?, 
       stock = ?, 
       price = ?, 
       product_name = ?, 
       name = ?, 
       image_url = ?, 
       product_id = ? 
     WHERE 
       user_id = ? AND variant_id = ?`,
    [
      cartItem.quantity,
      cartItem.stock,
      cartItem.price,
      cartItem.product_name,
      cartItem.name,
      cartItem.image_url,
      cartItem.product_id,
      userId,
      cartItem.variant_id,
    ]
  );

  return result;
};

export const removeCartItem = async (userId: number, variantId: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM cart WHERE user_id = ? AND variant_id = ?`,
    [userId, variantId]
  );

  return result.affectedRows;
};

export const clearCartItem = async (userId: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM cart WHERE user_id = ?`,
    [userId]
  );

  return result.affectedRows;
};
