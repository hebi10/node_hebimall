import CommentModel from '../models/commentModel.js';

export const getComments = async (req, res) => {
    const eventId = parseInt(req.params.eventId, 10);

    try {
        const comments = await CommentModel.getCommentsByEventId(eventId);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load comments.' });
    }
};

export const addComment = async (req, res) => {
    const { eventId, comment } = req.body;
    const user = req.user; // req.user는 미들웨어를 통해 설정된 사용자 정보

    try {
        const newComment = await CommentModel.createComment({
            eventId,
            userId: user.userId,
            nickname: user.nickname,
            comment,
            createdAt: new Date(),
        });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: 'Failed to save comment.' });
    }
};

export const updateComment = async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const { comment } = req.body;
    const user = req.user;

    try {
        const updatedComment = await CommentModel.updateComment(commentId, comment, user);
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.json(updatedComment);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update comment.' });
    }
};

export const deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const user = req.user;

    try {
        const deletedComment = await CommentModel.deleteComment(commentId, user);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete comment.' });
    }
};
