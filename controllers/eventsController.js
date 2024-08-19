import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../data/events.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // JWT 비밀 키 설정

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

// JWT 토큰 검증 및 사용자 정보 추출
const verifyToken = (req) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        throw new Error('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        throw new Error('Forbidden');
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await readFile(DATA_FILE_PATH);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getEventById = async (req, res) => {
    const eventId = parseInt(req.params.id, 10);

    try {
        const events = await readFile(DATA_FILE_PATH);
        const event = events.find(e => e.id === eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createEvent = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, content } = req.body;

    try {
        const events = await readFile(DATA_FILE_PATH);
        const newEvent = {
            id: events.length ? events[events.length - 1].id + 1 : 1,
            title,
            content,
            authorId: user.userId, // 토큰에서 추출한 userId 사용
            createdAt: new Date()
        };

        events.push(newEvent);
        await writeFile(DATA_FILE_PATH, events);

        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateEvent = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const eventId = parseInt(req.params.id, 10);
    const { title, content } = req.body;

    try {
        const events = await readFile(DATA_FILE_PATH);
        const eventIndex = events.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        events[eventIndex].title = title;
        events[eventIndex].content = content;
        events[eventIndex].updatedAt = new Date();

        await writeFile(DATA_FILE_PATH, events);

        res.json(events[eventIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteEvent = async (req, res) => {
    let user;
    try {
        user = verifyToken(req); // 토큰 검증 및 사용자 정보 추출
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const eventId = parseInt(req.params.id, 10);

    try {
        let events = await readFile(DATA_FILE_PATH);
        const eventIndex = events.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        events = events.filter(e => e.id !== eventId);

        await writeFile(DATA_FILE_PATH, events);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
