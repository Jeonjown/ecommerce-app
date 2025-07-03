import express from 'express';
import {
  loginUserController,
  signupUserController,
} from '../controllers/authControllers';

const router = express.Router();

router.post('/signup', signupUserController);
router.post('/login', loginUserController);

export default router;
