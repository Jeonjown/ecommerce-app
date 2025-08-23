import express from 'express';
import {
  createAddressController,
  getAddressesController,
  getAddressByIdController,
  updateAddressController,
  deleteAddressController,
} from '../controllers/addressController';

const router = express.Router();

router.post('/', createAddressController);

router.get('/me', getAddressesController);

router.get('/:id', getAddressByIdController);

router.patch('/:id', updateAddressController);

router.delete('/:id', deleteAddressController);

export default router;
