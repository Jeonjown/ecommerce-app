import express from 'express';
import {
  createProductController,
  deleteProductController,
  editProductController,
  getProductController,
  getProductsController,
} from '../controllers/productController';

const router = express.Router();

router.post('/', createProductController);

router.get('/', getProductsController);
router.get('/:id', getProductController);

router.patch('/:id', editProductController);

router.delete('/:id', deleteProductController);

export default router;
