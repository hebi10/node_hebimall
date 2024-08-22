import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../data/comments.json');

class CommentModel {
    static async getAllComments() {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
        return JSON.parse(data);
    }

    static async saveAllComments(comments) {
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(comments, null, 4));
    }

    static async getCommentsByEventId(eventId) {
        const comments = await this.getAllComments();
        return comments.filter(comment => comment.eventId === eventId);
    }

    static async createComment(newComment) {
        const comments = await this.getAllComments();
        newComment.id = comments.length ? comments[comments.length - 1].id + 1 : 1;
        comments.push(newComment);
        await this.saveAllComments(comments);
        return newComment;
    }

    static async updateComment(commentId, updatedComment, user) {
        const comments = await this.getAllComments();
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return null;
        }

        if (comments[commentIndex].userId !== user.userId && user.role !== 'admin') {
            throw new Error('Forbidden');
        }

        comments[commentIndex].comment = updatedComment;
        comments[commentIndex].updatedAt = new Date();

        await this.saveAllComments(comments);
        return comments[commentIndex];
    }

    static async deleteComment(commentId, user) {
        const comments = await this.getAllComments();
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return null;
        }

        if (comments[commentIndex].userId !== user.userId && user.role !== 'admin') {
            throw new Error('Forbidden');
        }

        const [deletedComment] = comments.splice(commentIndex, 1);
        await this.saveAllComments(comments);
        return deletedComment;
    }
}

export default CommentModel;
