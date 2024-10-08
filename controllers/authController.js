import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            userId: user.userId,
            nickname: user.nickname,
            role: user.role,
          }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    res.json({ message: 'Logout successful' });
};
