import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '../data/users.json');

class UserModel {
    static async getAllUsers() {
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(usersData);
    }

    static async saveAllUsers(users) {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    }

    static async findById(id) {
        const users = await this.getAllUsers();
        return users.find(user => user._id === id);
    }

    static async createUser(userData) {
        const users = await this.getAllUsers();
        users.push(userData);
        await this.saveAllUsers(users);
        return userData;
    }

    static async updateUser(id, updatedData) {
        const users = await this.getAllUsers();
        const userIndex = users.findIndex(user => user._id === id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedData };
            await this.saveAllUsers(users);
            return users[userIndex];
        }
        return null;
    }

    static async deleteUser(id) {
        const users = await this.getAllUsers();
        const userIndex = users.findIndex(user => user._id === id);
        if (userIndex !== -1) {
            const deletedUser = users.splice(userIndex, 1);
            await this.saveAllUsers(users);
            return deletedUser[0];
        }
        return null;
    }

    static async isUserIdUnique(id) {
        const users = await this.getAllUsers();
        return !users.some(user => user._id === id);
    }
}

export default UserModel;
