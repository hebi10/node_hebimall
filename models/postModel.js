const fs = require('fs');
const path = require('path');

const postsFilePath = path.join(__dirname, '../data/posts.json');

class PostModel {
    constructor(id, userId, title, content) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
    }

    static getAllPosts() {
        const postsData = fs.readFileSync(postsFilePath, 'utf8');
        return JSON.parse(postsData);
    }

    static saveAllPosts(posts) {
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
    }

    static findById(id) {
        const posts = this.getAllPosts();
        return posts.find(post => post.id === id);
    }

    static createPost(postData) {
        const posts = this.getAllPosts();
        posts.push(postData);
        this.saveAllPosts(posts);
        return postData;
    }

    static updatePost(id, updatedData) {
        const posts = this.getAllPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            posts[postIndex] = { ...posts[postIndex], ...updatedData };
            this.saveAllPosts(posts);
            return posts[postIndex];
        }
        return null;
    }

    static deletePost(id) {
        const posts = this.getAllPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            const deletedPost = posts.splice(postIndex, 1);
            this.saveAllPosts(posts);
            return deletedPost[0];
        }
        return null;
    }

    static findByUserId(userId) {
        const posts = this.getAllPosts();
        return posts.filter(post => post.userId === userId);
    }
}

module.exports = PostModel;
