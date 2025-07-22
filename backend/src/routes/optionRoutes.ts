import express from 'express';

import {
  getAllOptionsController,
  getOptionsbyProductIdController,
} from '../controllers/optionsController';
const router = express.Router();

router.get('/:id', getOptionsbyProductIdController);

router.get('/', getAllOptionsController);

export default router;
