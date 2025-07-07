import express from 'express';
import {
  loginUserController,
  logoutUserController,
  signupUserController,
} from '../controllers/authControllers';

const router = express.Router();

router.post('/signup', signupUserController);
router.post('/login', loginUserController);
router.post('/logout', logoutUserController);

export default router;
