const fs = require('fs').promises;
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../data/orders.json');

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

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await readFile(DATA_FILE_PATH);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    const orderId = parseInt(req.params.id, 10);

    try {
        const orders = await readFile(DATA_FILE_PATH);
        const order = orders.find(o => o.id === orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOrder = async (req, res) => {
    const { userId, items, totalPrice } = req.body;

    try {
        const orders = await readFile(DATA_FILE_PATH);
        const newOrder = {
            id: orders.length ? orders[orders.length - 1].id + 1 : 1,
            userId,
            items,
            totalPrice,
            status: 'pending',
            createdAt: new Date()
        };

        orders.push(newOrder);
        await writeFile(DATA_FILE_PATH, orders);

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const { status } = req.body;

    try {
        const orders = await readFile(DATA_FILE_PATH);
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        orders[orderIndex].status = status;

        await writeFile(DATA_FILE_PATH, orders);

        res.json(orders[orderIndex]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    const orderId = parseInt(req.params.id, 10);

    try {
        let orders = await readFile(DATA_FILE_PATH);
        orders = orders.filter(o => o.id !== orderId);

        await writeFile(DATA_FILE_PATH, orders);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
