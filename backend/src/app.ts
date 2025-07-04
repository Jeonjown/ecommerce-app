import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

import { errorHandler } from './middlewares/errorHandler';
import { authenticateUser } from './middlewares/authenticateUser';
import { checkUserRole } from './middlewares/checkUserRole';

const app = express();

// parsers
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api/users', authenticateUser, checkUserRole('admin'), userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
