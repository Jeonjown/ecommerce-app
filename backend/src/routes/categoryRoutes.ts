import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  editCategoryController,
  getCategoryController,
} from '../controllers/categoryController';
const router = express.Router();

router.get('/', getCategoryController);
router.post('/', createCategoryController);
router.patch('/:id', editCategoryController);
router.delete('/:id', deleteCategoryController);

export default router;
