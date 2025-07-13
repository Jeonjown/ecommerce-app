import express from 'express';
import {
  // createUserController,
  getLoggedInUserController,
  getUsersController,
} from '../controllers/userControllers';

const router = express.Router();

router.get('/', getUsersController);

router.get('/me', getLoggedInUserController);

export default router;
