import jwt from 'jsonwebtoken';
import Post from '../models/postModel.js';

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

// 모든 게시글 가져오기
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ID로 게시글 가져오기
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 게시글 생성
export const createPost = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const { title, content } = req.body;

    try {
        const newPost = new Post({ title, content, authorId: user.userId });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 게시글 업데이트
export const updatePost = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const { title, content } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 작성자 또는 관리자인지 확인
        if (post.authorId !== user.userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        post.title = title;
        post.content = content;
        post.updatedAt = Date.now();

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 게시글 삭제
export const deletePost = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 작성자 또는 관리자인지 확인
        if (post.authorId !== user.userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
