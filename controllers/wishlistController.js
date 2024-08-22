import Wishlist from '../models/wishlistModell_temp.js';

export const getWishlistByUserId = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('items.product');
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $push: { items: { product: productId } } },
            { new: true, upsert: true }
        ).populate('items.product');
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { new: true }
        ).populate('items.product');
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
