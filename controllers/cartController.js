const fs = require('fs').promises;
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/cart.json');

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

exports.getCart = async (req, res) => {
    try {
        const cart = await readFile(DATA_FILE_PATH);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await readFile(DATA_FILE_PATH);
        const newItem = { userId, productId, quantity };
        cart.push(newItem);

        await writeFile(DATA_FILE_PATH, cart);

        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCartItem = async (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const { quantity } = req.body;

    try {
        const cart = await readFile(DATA_FILE_PATH);
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        cart[itemIndex].quantity = quantity;

        await writeFile(DATA_FILE_PATH, cart);

        res.json(cart[itemIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    try {
        let cart = await readFile(DATA_FILE_PATH);
        cart = cart.filter(item => item.id !== itemId);

        await writeFile(DATA_FILE_PATH, cart);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
