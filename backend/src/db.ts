import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Detect if running locally or on Render
const isRender = process.env.RENDER === 'true';

const sslConfig = isRender
  ? {
      key: fs.readFileSync('/etc/secrets/key.pem'),
      cert: fs.readFileSync('/etc/secrets/ca.pem'),
      rejectUnauthorized: true,
    }
  : undefined; // no SSL locally

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
});

export default pool;
