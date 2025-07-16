import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  editCategoryController,
  getCategoryController,
  getProductsByCategorySlugController,
} from '../controllers/categoryController';
const router = express.Router();

router.get('/', getCategoryController);
router.get('/:slug/products', getProductsByCategorySlugController);

router.post('/', createCategoryController);
router.patch('/:id', editCategoryController);
router.delete('/:id', deleteCategoryController);

export default router;
