import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const user = await User.findOne({ userId });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                nickname: user.nickname,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong, please try again later' });
    }
};

export const logout = async (req, res) => {
    res.json({ message: 'Logout successful' });
};
