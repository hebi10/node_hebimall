const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

class UserModel {
    constructor(id, password, nickname) {
        this.id = id;
        this.password = password;
        this.nickname = nickname;
    }

    static getAllUsers() {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(usersData);
    }

    static saveAllUsers(users) {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    }

    static findById(id) {
        const users = this.getAllUsers();
        return users.find(user => user.id === id);
    }

    static createUser(userData) {
        const users = this.getAllUsers();
        users.push(userData);
        this.saveAllUsers(users);
        return userData;
    }

    static updateUser(id, updatedData) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedData };
            this.saveAllUsers(users);
            return users[userIndex];
        }
        return null;
    }

    static deleteUser(id) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            const deletedUser = users.splice(userIndex, 1);
            this.saveAllUsers(users);
            return deletedUser[0];
        }
        return null;
    }

    static isUserIdUnique(id) {
        const users = this.getAllUsers();
        return !users.some(user => user.id === id);
    }
}

module.exports = UserModel;
