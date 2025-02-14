import express from 'express';
import { getCommentsByProductId, addComment, updateComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/event/:eventId', getCommentsByProductId);
router.post('/', addComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
