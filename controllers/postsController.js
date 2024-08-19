import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../data/posts.json');
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

export const getAllPosts = (req, res) => {
    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        res.json(posts);
    });
};

export const getPostById = (req, res) => {
    const postId = parseInt(req.params.id, 10);

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        const post = posts.find(p => p.id === postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.json(post);
    });
};

export const createPost = (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const { title, content } = req.body;

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        const newPost = {
            id: posts.length ? posts[posts.length - 1].id + 1 : 1,
            title,
            content,
            authorId: user.userId, // JWT에서 추출한 userId 사용
            createdAt: new Date()
        };

        posts.push(newPost);

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to save post.' });
            }
            res.status(201).json(newPost);
        });
    });
};

export const updatePost = (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const postId = parseInt(req.params.id, 10);
    const { title, content } = req.body;

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 게시글 작성자 또는 관리자만 수정 가능
        if (posts[postIndex].authorId !== user.userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        posts[postIndex].title = title;
        posts[postIndex].content = content;
        posts[postIndex].updatedAt = new Date();

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update post.' });
            }
            res.json(posts[postIndex]);
        });
    });
};

export const deletePost = (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const postId = parseInt(req.params.id, 10);

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        let posts = JSON.parse(data);
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 게시글 작성자 또는 관리자만 삭제 가능
        if (posts[postIndex].authorId !== user.userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        posts = posts.filter(p => p.id !== postId);

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete post.' });
            }
            res.status(204).end();
        });
    });
};
