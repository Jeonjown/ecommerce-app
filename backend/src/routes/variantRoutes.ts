// src/routes/productRoutes.ts
import { Router } from 'express';
import { getVariantbyIdController } from '../controllers/variantController';

const router = Router();

router.get('/:id', getVariantbyIdController);

export default router;
