const express = require('express');
const { getReviewsByProductId, createReview, updateReview, deleteReview } = require('../controllers/reviewsController');

const router = express.Router();

router.get('/product/:productId', getReviewsByProductId);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
