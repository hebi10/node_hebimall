import Cart from '../models/cartModel.js';

export const getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $push: { items: { product: productId, quantity } } },
            { new: true, upsert: true }
        ).populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateCartItem = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero" });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId, "items.product": productId },
            { $set: { "items.$.quantity": quantity } },
            { new: true }
        ).populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        ).populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
