import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsFilePath = path.join(__dirname, '../data/posts.json');

class PostModel {
    static async getAllPosts() {
        const postsData = await fs.readFile(postsFilePath, 'utf8');
        return JSON.parse(postsData);
    }

    static async saveAllPosts(posts) {
        await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
    }

    static async findById(id) {
        const posts = await this.getAllPosts();
        return posts.find(post => post._id === id);
    }

    static async createPost(postData) {
        const posts = await this.getAllPosts();
        posts.push(postData);
        await this.saveAllPosts(posts);
        return postData;
    }

    static async updatePost(id, updatedData) {
        const posts = await this.getAllPosts();
        const postIndex = posts.findIndex(post => post._id === id);
        if (postIndex !== -1) {
            posts[postIndex] = { ...posts[postIndex], ...updatedData };
            await this.saveAllPosts(posts);
            return posts[postIndex];
        }
        return null;
    }

    static async deletePost(id) {
        const posts = await this.getAllPosts();
        const postIndex = posts.findIndex(post => post._id === id);
        if (postIndex !== -1) {
            const deletedPost = posts.splice(postIndex, 1);
            await this.saveAllPosts(posts);
            return deletedPost[0];
        }
        return null;
    }

    static async findByUserId(userId) {
        const posts = await this.getAllPosts();
        return posts.filter(post => post.userId === userId);
    }
}

export default PostModel;
