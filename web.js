const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
import * as dotenv from 'dotenv';
dotenv.config();

const productsRoutes = require('./routes/products');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/auth');
const reviewsRoutes = require('./routes/reviews');
const eventsRoutes = require('./routes/events');
const commentsRoutes = require('./routes/comments'); 

const app = express();

// 여러 출처를 허용하도록 CORS 설정 변경
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'https://sevim0104.cafe24.com',
    'https://hebi10.github.io'
];

app.use(cors({
    origin: function (origin, callback) {
        // 허용된 출처가 없는 경우 (예: 클라이언트가 동일한 출처에서 실행되는 경우)
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

app.use(cookieParser());
app.use(bodyParser.json());

// 정적 파일 경로 설정
app.use('/.well-known/pki-validation', express.static(path.join(__dirname, '.well-known/pki-validation')));
app.use(express.static(path.join(__dirname, 'views')));

// 라우트 설정
app.use('/products', productsRoutes);
app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
app.use('/order', orderRoutes);
app.use('/auth', authRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/events', eventsRoutes);  // 이벤트 라우터 추가
app.use('/comments', commentsRoutes);  // 댓글 라우터 추가

// 로그인 상태 확인 미들웨어
const checkLogin = (req, res, next) => {
    if (req.cookies.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// 관리자 권한 확인 미들웨어
const checkAdmin = (req, res, next) => {
    if (req.cookies.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
};

// 보호된 라우트 예시
app.use('/protected', checkLogin, (req, res) => {
    res.json({ message: `You are logged in as ${req.cookies.nickname}!` });
});

// 관리자 전용 라우트 예시
app.use('/admin', checkLogin, checkAdmin, (req, res) => {
    res.json({ message: 'Welcome to the admin panel!' });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
