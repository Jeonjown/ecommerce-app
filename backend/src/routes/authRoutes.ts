import express from 'express';
import { signupUserController } from '../controllers/authControllers';

const router = express.Router();

router.post('/signup', signupUserController);

export default router;
