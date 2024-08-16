const fs = require('fs').promises;
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/events.json');

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

exports.getAllEvents = async (req, res) => {
    try {
        const events = await readFile(DATA_FILE_PATH);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEventById = async (req, res) => {
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

exports.createEvent = async (req, res) => {
    if (req.cookies.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, content } = req.body;

    try {
        const events = await readFile(DATA_FILE_PATH);
        const newEvent = {
            id: events.length ? events[events.length - 1].id + 1 : 1,
            title,
            content,
            authorId: req.cookies.userId,
            createdAt: new Date()
        };

        events.push(newEvent);
        await writeFile(DATA_FILE_PATH, events);

        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    if (req.cookies.role !== 'admin') {
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

exports.deleteEvent = async (req, res) => {
    if (req.cookies.role !== 'admin') {
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
