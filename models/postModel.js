import mongoose from 'mongoose';

// 게시글 스키마 정의
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 작성자 ID
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Post 모델 생성
const Post = mongoose.model('Post', postSchema);

export default Post;
