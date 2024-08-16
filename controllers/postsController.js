const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/posts.json');

exports.getAllPosts = (req, res) => {
    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        res.json(posts);
    });
};

exports.getPostById = (req, res) => {
    const postId = parseInt(req.params.id, 10);

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        const post = posts.find(p => p.id === postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.json(post);
    });
};

exports.createPost = (req, res) => {
    const { title, content, authorId } = req.body;

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        const newPost = {
            id: posts.length ? posts[posts.length - 1].id + 1 : 1,
            title,
            content,
            authorId,
            createdAt: new Date()
        };

        posts.push(newPost);

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to save post.' });
            }
            res.status(201).json(newPost);
        });
    });
};

exports.updatePost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { title, content } = req.body;

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        const posts = JSON.parse(data);
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 게시글 작성자 또는 관리자만 수정 가능
        if (posts[postIndex].authorId !== req.cookies.userId && req.cookies.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        posts[postIndex].title = title;
        posts[postIndex].content = content;
        posts[postIndex].updatedAt = new Date();

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to update post.' });
            }
            res.json(posts[postIndex]);
        });
    });
};

exports.deletePost = (req, res) => {
    const postId = parseInt(req.params.id, 10);

    fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to load posts.' });
        }

        let posts = JSON.parse(data);
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 게시글 작성자 또는 관리자만 삭제 가능
        if (posts[postIndex].authorId !== req.cookies.userId && req.cookies.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        posts = posts.filter(p => p.id !== postId);

        fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete post.' });
            }
            res.status(204).end();
        });
    });
};
