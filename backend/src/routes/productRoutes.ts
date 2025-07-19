// src/routes/productRoutes.ts
import { Router } from 'express';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from '../controllers/productController';

const router = Router();

router.get('/', getAllProductsController);
router.get('/:id', getProductByIdController);

router.post('/', createProductController);

router.put('/:id', updateProductController);

router.delete('/:id', deleteProductController);

export default router;
