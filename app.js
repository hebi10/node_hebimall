import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경변수 설정
dotenv.config();

// 라우트 파일 가져오기
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import postsRoutes from './routes/posts.js';
import usersRoutes from './routes/users.js';
import cartRoutes from './routes/cart.js';
import paymentRoutes from './routes/payment.js';
import orderRoutes from './routes/order.js';
import reviewsRoutes from './routes/reviews.js';
import eventsRoutes from './routes/events.js';
import commentsRoutes from './routes/comments.js';

const app = express();

// CORS 설정
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'https://sevim0104.cafe24.com',
    'https://hebi10.github.io',
    'http://localhost:3001'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('Not allowed by CORS'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600
}));

app.use(bodyParser.json());

// 정적 파일 경로 설정
app.use('/.well-known/pki-validation', express.static(path.join(__dirname, '.well-known/pki-validation')));
app.use(express.static(path.join(__dirname, 'views')));

// 정적 파일 제공 - React의 빌드된 파일 제공
app.use(express.static(path.join(__dirname, 'build')));

// JWT 인증 미들웨어
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Authorization 헤더에서 토큰 추출
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded; // 토큰이 유효한 경우 사용자 정보 저장
        next();
    });
};

// 관리자 권한 확인 미들웨어
const checkAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
};

// 보호된 라우트
app.use('/protected', verifyToken, (req, res) => {
    res.json({ message: `You are logged in as ${req.user.userId}!` });
});

// 관리자 전용 라우트
app.use('/admin', verifyToken, checkAdmin, (req, res) => {
    res.json({ message: 'Welcome to the admin panel!' });
});

// 라우트 설정
app.use('/products', productsRoutes);
app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
app.use('/order', orderRoutes);
app.use('/auth', authRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/events', eventsRoutes);
app.use('/comments', commentsRoutes);

// 모든 경로를 React의 index.html로 리디렉션
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8001;

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
