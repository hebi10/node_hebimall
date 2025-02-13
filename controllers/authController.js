import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

export const login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await UserModel.findOne({ userId });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // ✅ 운영 환경에서만 HTTPS 적용
            sameSite: 'Lax',  // ✅ CORS 문제 방지
            maxAge: 60 * 60 * 1000, // 1시간 유지
        });

        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    res.status(200).json({ message: 'Logged out successfully' });
};
