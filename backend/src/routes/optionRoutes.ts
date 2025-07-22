import express from 'express';

import {
  createOptionController,
  deleteOptionsByOptionsIdController,
  getAllOptionsController,
  getOptionsbyProductIdController,
} from '../controllers/optionsController';
const router = express.Router();

router.get('/:id', getOptionsbyProductIdController);
router.get('/', getAllOptionsController);

router.post('/:id', createOptionController);

router.delete('/:id', deleteOptionsByOptionsIdController);

export default router;
