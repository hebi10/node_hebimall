import express from 'express';
import { getCart, addToCart, updateCartItem, deleteCartItem } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

export default router;
