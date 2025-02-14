import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import commentRoutes from './routes/comments.js';
import eventsRoutes from './routes/events.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';
import postsRoutes from './routes/posts.js';
import productsRoutes from './routes/products.js';
import reviewsRoutes from './routes/reviews.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { DATABASE_URL, JWT_SECRET, PORT = 3000 } = process.env;
if (!DATABASE_URL) {
  console.error("🚨 DATABASE_URL is not defined in .env file!");
  process.exit(1);
}

mongoose.connect(DATABASE_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const app = express();

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'https://sevim0104.cafe24.com',
  'https://hebi10.github.io',
  'http://localhost:3001',
  'https://node-hebimall.onrender.com'
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/comments', commentRoutes);
app.use('/events', eventsRoutes);
app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/posts', postsRoutes);
app.use('/products', productsRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
