// src/routes/productRoutes.ts
import { Router } from 'express';
import {
  createVariantByIdController,
  deleteVariantByIdController,
  getVariantbyIdController,
  getVariantOptionsByVariantIdController,
} from '../controllers/variantController';

const router = Router();

router.get('/:id/options', getVariantOptionsByVariantIdController);
router.get('/:id', getVariantbyIdController);
router.post('/:id', createVariantByIdController);
router.delete('/:id', deleteVariantByIdController);

export default router;
