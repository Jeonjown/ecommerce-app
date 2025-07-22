import express from 'express';

import {
  deleteOptionsByOptionsIdController,
  getAllOptionsController,
  getOptionsbyProductIdController,
} from '../controllers/optionsController';
const router = express.Router();

router.get('/:id', getOptionsbyProductIdController);

router.get('/', getAllOptionsController);

router.delete('/:id', deleteOptionsByOptionsIdController);

export default router;
