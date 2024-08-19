import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();

// MongoDB 연결
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 각 모델 스키마 정의
const userSchema = new mongoose.Schema({
  userId: String,
  password: String,
  nickname: String,
  role: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String,
  category: String,
});

const cartSchema = new mongoose.Schema({
  userId: String,
  items: Array,
});

const categorySchema = new mongoose.Schema({
  name: String,
});

const commentSchema = new mongoose.Schema({
  eventId: Number,
  userId: String,
  nickname: String,
  comment: String,
  createdAt: Date,
});

const eventSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: String,
  createdAt: Date,
});

const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  paymentMethod: String,
  address: String,
  status: String,
  createdAt: Date,
});

const postSchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
});

const reviewSchema = new mongoose.Schema({
  productId: Number,
  userId: String,
  nickname: String,
  rating: Number,
  comment: String,
  createdAt: Date,
});

// 모델 생성
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Category = mongoose.model('Category', categorySchema);
const Comment = mongoose.model('Comment', commentSchema);
const Event = mongoose.model('Event', eventSchema);
const Order = mongoose.model('Order', orderSchema);
const Post = mongoose.model('Post', postSchema);
const Review = mongoose.model('Review', reviewSchema);

// 시드 데이터를 삽입하는 함수
const seedData = async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Category.deleteMany({});
    await Comment.deleteMany({});
    await Event.deleteMany({});
    await Order.deleteMany({});
    await Post.deleteMany({});
    await Review.deleteMany({});
    console.log('Existing data deleted successfully.');

    // Users
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));
    await User.insertMany(usersData);
    console.log('Users data seeded successfully.');

    // Products
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf-8'));
    await Product.insertMany(productsData);
    console.log('Products data seeded successfully.');

    // Carts
    const cartsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/carts.json'), 'utf-8'));
    await Cart.insertMany(cartsData);
    console.log('Carts data seeded successfully.');

    // Categories
    const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/categories.json'), 'utf-8'));
    await Category.insertMany(categoriesData);
    console.log('Categories data seeded successfully.');

    // Comments
    const commentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comments.json'), 'utf-8'));
    await Comment.insertMany(commentsData);
    console.log('Comments data seeded successfully.');

    // Events
    const eventsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/events.json'), 'utf-8'));
    await Event.insertMany(eventsData);
    console.log('Events data seeded successfully.');

    // Orders
    const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/orders.json'), 'utf-8'));
    await Order.insertMany(ordersData);
    console.log('Orders data seeded successfully.');

    // Posts
    const postsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/posts.json'), 'utf-8'));
    await Post.insertMany(postsData);
    console.log('Posts data seeded successfully.');

    // Reviews
    const reviewsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/reviews.json'), 'utf-8'));
    await Review.insertMany(reviewsData);
    console.log('Reviews data seeded successfully.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedData();
