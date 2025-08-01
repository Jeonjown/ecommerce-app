import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  editCategoryController,
  getCategoryByIdController,
  getCategoryController,
  getProductsByCategorySlugController,
} from '../controllers/categoryController';
import { checkUserRole } from '../middlewares/checkUserRole';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = express.Router();

//  Public routes
router.get('/', getCategoryController);
router.get('/:id', getCategoryByIdController);
router.get('/:slug/products', getProductsByCategorySlugController);

// Admin-only routes
router.post(
  '/',
  authenticateUser,
  checkUserRole('admin'),
  createCategoryController
);
router.patch(
  '/:id',
  authenticateUser,
  checkUserRole('admin'),
  editCategoryController
);
router.delete(
  '/:id',
  authenticateUser,
  checkUserRole('admin'),
  deleteCategoryController
);

export default router;
