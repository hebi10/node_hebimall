const fs = require('fs').promises;
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/users.json');

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Failed to read file');
    }
}

async function writeFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
    } catch (err) {
        throw new Error('Failed to write file');
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await readFile(DATA_FILE_PATH);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const users = await readFile(DATA_FILE_PATH);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    const { id, password, nickname } = req.body;

    try {
        const users = await readFile(DATA_FILE_PATH);
        const newUser = {
            id,
            password,
            nickname,
            createdAt: new Date()
        };

        users.push(newUser);
        await writeFile(DATA_FILE_PATH, users);

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { password, nickname } = req.body;

    try {
        const users = await readFile(DATA_FILE_PATH);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found.' });
        }

        users[userIndex].password = password;
        users[userIndex].nickname = nickname;
        users[userIndex].updatedAt = new Date();

        await writeFile(DATA_FILE_PATH, users);

        res.json(users[userIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        let users = await readFile(DATA_FILE_PATH);
        users = users.filter(u => u.id !== userId);

        await writeFile(DATA_FILE_PATH, users);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
