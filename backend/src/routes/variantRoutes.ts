// src/routes/productRoutes.ts
import { Router } from 'express';
import {
  createVariantByIdController,
  deleteVariantByIdController,
  getVariantByIdController,
  getVariantOptionsByVariantIdController,
  updateVariantController,
} from '../controllers/variantController';

const router = Router();

router.get('/:id', getVariantByIdController);
router.post('/:id', createVariantByIdController);
router.patch('/:id', updateVariantController);
router.delete('/:id', deleteVariantByIdController);

router.get('/:id/options', getVariantOptionsByVariantIdController);

export default router;
