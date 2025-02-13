import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// 환경 변수 로드
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 설정
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 8001;

// 라우트 파일 가져오기
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import postsRoutes from './routes/posts.js';
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
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // ✅ 쿠키 포함 요청 허용
}));

// 미들웨어 추가
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());  // ✅ 쿠키 파서 추가

// MongoDB 연결
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/posts', postsRoutes);
// 필요한 다른 API 엔드포인트 추가

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
