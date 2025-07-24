// src/routes/productRoutes.ts
import { Router } from 'express';
import {
  deleteVariantByIdController,
  getVariantbyIdController,
  getVariantOptionsByVariantIdController,
} from '../controllers/variantController';

const router = Router();

router.get('/:id/options', getVariantOptionsByVariantIdController);
router.get('/:id', getVariantbyIdController);
router.delete('/:id', deleteVariantByIdController);

export default router;
