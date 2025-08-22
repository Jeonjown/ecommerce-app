import express from 'express';
import {
  demoteUserController,
  // createUserController,
  getLoggedInUserController,
  getUserByIdController,
  getUsersController,
  promoteUserController,
} from '../controllers/userControllers';

const router = express.Router();

router.get('/', getUsersController);
router.get('/me', getLoggedInUserController);
router.get('/:id', getUserByIdController);
router.patch('/:userId/promote', promoteUserController);
router.patch('/:userId/demote', demoteUserController);

export default router;
