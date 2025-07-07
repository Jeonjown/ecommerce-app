import express from 'express';
import {
  createUserController,
  getLoggedInUser,
  getUsersController,
} from '../controllers/userControllers';

const router = express.Router();

router.get('/', getUsersController);

router.get('/me', getLoggedInUser);

router.post('/', createUserController);

export default router;
