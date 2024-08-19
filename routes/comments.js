import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const DATA_FILE_PATH = path.join(__dirname, '../data/comments.json');

// 댓글 목록 조회 (이벤트별)
router.get('/event/:eventId', async (req, res) => {
    const eventId = parseInt(req.params.eventId, 10);

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        const comments = JSON.parse(data);
        const eventComments = comments.filter(comment => comment.eventId === eventId);
        res.json(eventComments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load comments.' });
    }
});

// 댓글 작성
router.post('/', async (req, res) => {
    const { eventId, userId, nickname, comment } = req.body;

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        const comments = JSON.parse(data);
        const newComment = {
            id: comments.length ? comments[comments.length - 1].id + 1 : 1,
            eventId,
            userId,
            nickname,
            comment,
            createdAt: new Date()
        };

        comments.push(newComment);

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(comments, null, 4));
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: 'Failed to save comment.' });
    }
});

// 댓글 수정
router.put('/:id', async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const { comment } = req.body;

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        const comments = JSON.parse(data);
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        if (comments[commentIndex].userId !== req.cookies.userId && req.cookies.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        comments[commentIndex].comment = comment;
        comments[commentIndex].updatedAt = new Date();

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(comments, null, 4));
        res.json(comments[commentIndex]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update comment.' });
    }
});

// 댓글 삭제
router.delete('/:id', async (req, res) => {
    const commentId = parseInt(req.params.id, 10);

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        let comments = JSON.parse(data);
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        if (comments[commentIndex].userId !== req.cookies.userId && req.cookies.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        comments = comments.filter(c => c.id !== commentId);

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(comments, null, 4));
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete comment.' });
    }
});

export default router;
