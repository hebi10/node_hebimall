import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 작성자 ID, User 모델 참조
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

class PostModel {
    static async getAllPosts() {
        return await Post.find();  // 모든 게시글을 가져옵니다.
    }

    static async findById(id) {
        return await Post.findById(id);  // ID로 게시글을 검색합니다.
    }

    static async createPost(postData) {
        const post = new Post(postData);
        return await post.save();  // 새로운 게시글을 생성하고 저장합니다.
    }

    static async updatePost(id, updatedData) {
        return await Post.findByIdAndUpdate(id, updatedData, { new: true });  // 게시글 정보를 업데이트합니다.
    }

    static async deletePost(id) {
        return await Post.findByIdAndDelete(id);  // 게시글을 삭제합니다.
    }

    static async findByUserId(userId) {
        return await Post.find({ author: userId });  // 작성자의 ID로 게시글을 검색합니다.
    }
}

export default PostModel;
