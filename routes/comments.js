import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const DATA_FILE_PATH = path.join(__dirname, '../data/comments.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // JWT 비밀 키 설정

// JWT 토큰 검증 및 사용자 정보 추출
const verifyToken = (req) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        throw new Error('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        throw new Error('Forbidden');
    }
};

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
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const { eventId, comment } = req.body;

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        const comments = JSON.parse(data);
        const newComment = {
            id: comments.length ? comments[comments.length - 1].id + 1 : 1,
            eventId,
            userId: user.userId, // JWT에서 추출한 userId 사용
            nickname: user.nickname, // JWT에서 추출한 닉네임 사용
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
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const commentId = parseInt(req.params.id, 10);
    const { comment } = req.body;

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        const comments = JSON.parse(data);
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // 댓글 작성자 또는 관리자만 수정 가능
        if (comments[commentIndex].userId !== user.userId && user.role !== 'admin') {
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
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const commentId = parseInt(req.params.id, 10);

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        let comments = JSON.parse(data);
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // 댓글 작성자 또는 관리자만 삭제 가능
        if (comments[commentIndex].userId !== user.userId && user.role !== 'admin') {
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
