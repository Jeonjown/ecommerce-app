import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateUser } from './middlewares/authenticateUser';
import { checkUserRole } from './middlewares/checkUserRole';
import { errorHandler } from './middlewares/errorHandler';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import optionRoutes from './routes/optionRoutes';
import imageRoutes from './routes/imageRoutes';
import optionValueRoutes from './routes/optionValueRoutes';
import variantRoutes from './routes/variantRoutes';
import cartRoutes from './routes/cartRoutes';
import addressRoutes from './routes/addressRoutes';
import orderRoutes from './routes/orderRoutes';
import webhook from './routes/webhook';

const app = express();

// parsers
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://techhaven-backend.onrender.com',
      'https://ecommerce-app-two-dun.vercel.app',
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use(
  '/api/users',
  authenticateUser,
  checkUserRole('user', 'admin'),
  userRoutes
);

app.use('/api/categories', categoryRoutes);

app.use(
  '/api/products/options',
  authenticateUser,
  checkUserRole('admin'),
  optionRoutes
);

app.use(
  '/api/products/options-value',
  authenticateUser,
  checkUserRole('admin'),
  optionValueRoutes
);

app.use(
  '/api/products/variants',
  authenticateUser,
  checkUserRole('user', 'admin'),
  variantRoutes
);

app.use(
  '/api/cart',
  authenticateUser,
  checkUserRole('user', 'admin'),
  cartRoutes
);

app.use(
  '/api/orders',
  authenticateUser,
  checkUserRole('user', 'admin'),
  orderRoutes
);

app.use(
  '/api/users/address',
  authenticateUser,
  checkUserRole('user', 'admin'),
  addressRoutes
);

app.use('/api/products', productRoutes);

app.use('/api/images', imageRoutes);

app.use('/api/auth', authRoutes);

app.use('/stripe-webhook', webhook);

app.use(errorHandler);

export default app;
