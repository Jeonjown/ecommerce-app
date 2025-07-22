import express from 'express';
import { createOptionValueController } from '../controllers/optionValueController';

const router = express.Router();

router.post('/:id', createOptionValueController);

export default router;
