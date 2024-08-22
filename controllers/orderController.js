import Order from '../models/orderModel.js';

export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createOrder = async (req, res) => {
    const { userId, items, total } = req.body;

    try {
        const newOrder = new Order({ userId, items, total });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
