import express from 'express';
import {
  createUserController,
  getUsersController,
} from '../controllers/userControllers';
import { getUserByEmail } from '../models/userModel';

const router = express.Router();

router.get('/test', getUsersController);

router.post('/', createUserController);

export default router;
