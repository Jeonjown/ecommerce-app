import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Address } from '../types/models/address';

type AddressRow = Address & RowDataPacket;

// Get all addresses for a user
export const getAddressesByUserId = async (
  userId: number
): Promise<Address[]> => {
  const [rows] = await pool.query<AddressRow[]>(
    `SELECT id, user_id, full_name, phone, street_address, city, province, postal_code, country, is_default, created_at
     FROM addresses
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

// Get a single address by ID
export const getAddressById = async (
  id: number
): Promise<Address | undefined> => {
  const [rows] = await pool.query<AddressRow[]>(
    `SELECT id, user_id, full_name, phone, street_address, city, province, postal_code, country, is_default, created_at
     FROM addresses
     WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// Create a new address
export const createAddress = async (
  address: Omit<Address, 'id' | 'created_at'>
): Promise<Address> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO addresses (user_id, full_name, phone, street_address, city, province, postal_code, country, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      address.user_id,
      address.full_name,
      address.phone,
      address.street_address,
      address.city,
      address.province,
      address.postal_code,
      address.country || 'Philippines',
      address.is_default ? 1 : 0,
    ]
  );

  const [rows] = await pool.query<AddressRow[]>(
    `SELECT id, user_id, full_name, phone, street_address, city, province, postal_code, country, is_default, created_at
     FROM addresses
     WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
};

// Get a single address by id and user id
export const getAddressByIdAndUserId = async (
  id: number,
  userId: number
): Promise<Address | undefined> => {
  const [rows] = await pool.query<AddressRow[]>(
    `SELECT id, user_id, full_name, phone, street_address, city, province, postal_code, country, is_default, created_at
     FROM addresses
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return rows[0];
};

// Update address by id and user id, only if owned by user
export const updateAddressByIdAndUserId = async (
  id: number,
  userId: number,
  address: Partial<Address>
): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE addresses
     SET full_name = ?, phone = ?, street_address = ?, city = ?, province = ?, postal_code = ?, country = ?, is_default = ?
     WHERE id = ? AND user_id = ?`,
    [
      address.full_name,
      address.phone,
      address.street_address,
      address.city,
      address.province,
      address.postal_code,
      address.country,
      address.is_default ? 1 : 0,
      id,
      userId,
    ]
  );
  return result.affectedRows > 0;
};

// Delete address by id and user id, only if owned by user
export const deleteAddressByIdAndUserId = async (
  id: number,
  userId: number
): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM addresses WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result.affectedRows > 0;
};
