const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE_PATH = path.join(__dirname, '../data/comments.json');

// 댓글 목록 조회 (이벤트별)
router.get('/event/:eventId', (req, res) => {
    const eventId = parseInt(req.params.eventId, 10);

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load comments.' });
        }

        const comments = JSON.parse(data);
        const eventComments = comments.filter(comment => comment.eventId === eventId);
        res.json(eventComments);
    });
});

// 댓글 작성
router.post('/', (req, res) => {
    const { eventId, userId, nickname, comment } = req.body;

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load comments.' });
        }

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

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(comments, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to save comment.' });
            }
            res.status(201).json(newComment);
        });
    });
});

// 댓글 수정
router.put('/:id', (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    const { comment } = req.body;

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load comments.' });
        }

        const comments = JSON.parse(data);
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // 댓글 작성자 또는 관리자만 수정 가능
        if (comments[commentIndex].userId !== req.cookies.userId && req.cookies.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        comments[commentIndex].comment = comment;
        comments[commentIndex].updatedAt = new Date();

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(comments, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update comment.' });
            }
            res.json(comments[commentIndex]);
        });
    });
});

// 댓글 삭제
router.delete('/:id', (req, res) => {
    const commentId = parseInt(req.params.id, 10);

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load comments.' });
        }

        let comments = JSON.parse(data);
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // 댓글 작성자 또는 관리자만 삭제 가능
        if (comments[commentIndex].userId !== req.cookies.userId && req.cookies.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        comments = comments.filter(c => c.id !== commentId);

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(comments, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete comment.' });
            }
            res.status(204).end();
        });
    });
});

module.exports = router;
