import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const users = await readFile(DATA_FILE_PATH);
        const user = users.find(u => u.id === id && u.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const cookieOptions = {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
            path: '/',
            sameSite: 'None',
            secure: false,
        };

        res.cookie('userId', user.id, cookieOptions);
        res.cookie('role', user.role, cookieOptions);
        res.json({ message: 'Login successful', user: { id: user.id, nickname: user.nickname } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('userId');
    res.clearCookie('role');
    res.json({ message: 'Logout successful' });
};
