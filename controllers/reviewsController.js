import Review from '../models/ReviewModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

export const getReviewsByProductId = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createReview = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    const { productId, rating, comment } = req.body;

    try {
        const newReview = new Review({
            productId,
            userId: user.userId,
            nickname: user.nickname,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateReview = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // 리뷰 작성자 또는 관리자만 수정 가능
        if (review.userId.toString() !== user.userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        review.updatedAt = new Date();

        await review.save();
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteReview = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // 리뷰 작성자 또는 관리자만 삭제 가능
        if (review.userId.toString() !== user.userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await review.deleteOne();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
