import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../data/reviews.json');

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Failed to read file');
    }
}

async function writeFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
    } catch (err) {
        throw new Error('Failed to write file');
    }
}

export const getReviewsByProductId = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);

    try {
        const reviews = await readFile(DATA_FILE_PATH);
        const productReviews = reviews.filter(r => r.productId === productId);
        res.json(productReviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createReview = async (req, res) => {
    const { productId, userId, nickname, rating, comment } = req.body;

    try {
        const reviews = await readFile(DATA_FILE_PATH);
        const newReview = {
            id: reviews.length ? reviews[reviews.length - 1].id + 1 : 1,
            productId,
            userId,
            nickname,
            rating,
            comment,
            createdAt: new Date()
        };

        reviews.push(newReview);
        await writeFile(DATA_FILE_PATH, reviews);

        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateReview = async (req, res) => {
    const reviewId = parseInt(req.params.id, 10);
    const { rating, comment } = req.body;

    try {
        const reviews = await readFile(DATA_FILE_PATH);
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);

        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // 리뷰 작성자 또는 관리자만 수정 가능
        if (reviews[reviewIndex].userId !== req.cookies.userId && req.cookies.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        reviews[reviewIndex].rating = rating;
        reviews[reviewIndex].comment = comment;
        reviews[reviewIndex].updatedAt = new Date();

        await writeFile(DATA_FILE_PATH, reviews);

        res.json(reviews[reviewIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteReview = async (req, res) => {
    const reviewId = parseInt(req.params.id, 10);

    try {
        let reviews = await readFile(DATA_FILE_PATH);
        reviews = reviews.filter(r => r.id !== reviewId);

        await writeFile(DATA_FILE_PATH, reviews);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
