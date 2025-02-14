import { getCartByUserId, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { Router } from 'express';

const router = Router();

router.get('/:userId', getCartByUserId);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);

export default router;
