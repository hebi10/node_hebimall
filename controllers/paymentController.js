import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '../data/payments.json');

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

export const createPayment = async (req, res) => {
    const { orderId, amount, method } = req.body;

    try {
        const payments = await readFile(DATA_FILE_PATH);
        const newPayment = {
            id: payments.length ? payments[payments.length - 1].id + 1 : 1,
            orderId,
            amount,
            method,
            createdAt: new Date()
        };

        payments.push(newPayment);
        await writeFile(DATA_FILE_PATH, payments);

        res.status(201).json(newPayment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPaymentById = async (req, res) => {
    const paymentId = parseInt(req.params.id, 10);

    try {
        const payments = await readFile(DATA_FILE_PATH);
        const payment = payments.find(p => p.id === paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
