import express from 'express';
import { createOptionValueController } from '../controllers/optionValueController';

const router = express.Router();

router.post('/:id', createOptionValueController);

router.get('/', (req, res) => {
  res.send('test');
});
export default router;
