import express from 'express';
import cookieParser from 'cookie-parser';

import testRoutes from './routes/testRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

import { errorHandler } from './middlewares/errorHandler';
import { authenticateUser } from './middlewares/authenticateUser';

const app = express();

// parsers
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api', testRoutes);
app.use('/api/users', authenticateUser, userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
