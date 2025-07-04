import express from 'express';
import {
  createUserController,
  getUsersController,
} from '../controllers/userControllers';

const router = express.Router();

router.get('/', getUsersController);

router.post('/', createUserController);

export default router;
