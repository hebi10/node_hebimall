import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET; // JWT 비밀 키를 .env 파일에서 가져옴

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

export const login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const users = await readFile(DATA_FILE_PATH);
        const user = users.find(u => u.userId === id && u.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, {
            expiresIn: '7d', // 토큰 유효 기간
        });

        // 클라이언트로 토큰 반환
        res.json({ message: 'Login successful', token, user: { id: user.id, nickname: user.nickname } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    res.json({ message: 'Logout successful' });
};
