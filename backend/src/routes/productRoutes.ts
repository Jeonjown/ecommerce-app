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

// GET    /api/products
router.get('/', getAllProductsController);

// GET    /api/products/:id
router.get('/:id', getProductByIdController);

// POST   /api/products
router.post('/', createProductController);

// PUT    /api/products/:id
router.put('/:id', updateProductController);

// DELETE /api/products/:id
router.delete('/:id', deleteProductController);

export default router;
