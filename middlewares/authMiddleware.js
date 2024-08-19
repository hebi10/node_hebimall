import UserModel from '../models/userModel.js';

export const authenticateUser = async (req, res, next) => {
    const { userId, password } = req.headers;

    try {
        const user = await UserModel.findById(userId);
        if (user && user.password === password) {
            req.user = user;
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during authentication' });
    }
};
