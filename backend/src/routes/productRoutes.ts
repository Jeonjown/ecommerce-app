// src/routes/productRoutes.ts
import { Router } from 'express';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getProductBySlugController,
} from '../controllers/productController';
import { getVariantsbyProductIdController } from '../controllers/variantController';

const router = Router();

router.post('/', createProductController);

router.get('/', getAllProductsController);
router.get('/:id', getProductByIdController);
router.get('/slug/:slug', getProductBySlugController);
router.get('/:id/variants', getVariantsbyProductIdController);

router.put('/:id', updateProductController);
router.delete('/:id', deleteProductController);

export default router;
