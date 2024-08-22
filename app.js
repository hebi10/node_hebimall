import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경변수 설정
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 8001;

// 라우트 파일 가져오기
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
// 필요한 다른 라우트들도 동일하게 가져오기

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

// JWT 인증 미들웨어
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid.' });
        }
        req.user = decoded;
        next();
    });
};

// 관리자 권한 확인 미들웨어
const checkAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: You do not have admin rights.' });
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
app.use('/auth', authRoutes);
// 필요한 다른 라우트도 동일하게 설정

// MongoDB 연결
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
