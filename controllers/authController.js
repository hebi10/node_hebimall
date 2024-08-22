import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        // 사용자를 userId로 찾기
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 비밀번호 해시 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    res.json({ message: 'Logout successful' });
};
