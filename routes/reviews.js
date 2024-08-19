import express from 'express';
import { getReviewsByProductId, createReview, updateReview, deleteReview } from '../controllers/reviewsController.js';

const router = express.Router();

router.get('/product/:productId', getReviewsByProductId);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
