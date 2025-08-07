import express from 'express';
import {
  addItemtoCartController,
  getCartItemsByLoggedUserController,
  removeItemFromCartController,
  syncUserCartController,
  updateItemFromCartController,
} from '../controllers/cartController';

const router = express.Router();

//  Sync full cart
router.post('/sync', syncUserCartController);

//  Add item to cart
router.post('/', addItemtoCartController);

//  Get current user's cart items
router.get('/', getCartItemsByLoggedUserController);

//  Update item in cart (e.g. quantity)
router.put('/', updateItemFromCartController);

//  Remove item from cart
router.delete('/:variant_id', removeItemFromCartController);

export default router;
