import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateUser } from './middlewares/authenticateUser';
import { checkUserRole } from './middlewares/checkUserRole';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// parsers
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api/users', authenticateUser, checkUserRole('admin'), userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
