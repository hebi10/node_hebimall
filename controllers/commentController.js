import Comment from '../models/commentModel.js';

export const getCommentsByProductId = async (req, res) => {
    try {
        const comments = await Comment.find({ productId: req.params.productId });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addComment = async (req, res) => {
    const { userId, productId, content } = req.body;

    try {
        const newComment = new Comment({ userId, productId, content });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
