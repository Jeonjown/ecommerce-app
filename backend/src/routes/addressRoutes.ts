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

router.get('/', getAddressesController);

router.get('/:id', getAddressByIdController);

router.put('/:id', updateAddressController);

router.delete('/:id', deleteAddressController);

export default router;
