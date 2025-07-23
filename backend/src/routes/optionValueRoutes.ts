import express from 'express';
import {
  createOptionValueController,
  deleteOptionValueByidController,
} from '../controllers/optionValueController';

const router = express.Router();

router.post('/:id', createOptionValueController);
router.delete('/:id', deleteOptionValueByidController);

export default router;
