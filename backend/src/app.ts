import express from 'express';
import testRoutes from './routes/testRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use('/api', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
