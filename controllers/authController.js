import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'; // User 모델 경로가 정확한지 확인하세요

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    // 클라이언트 측에서 JWT를 삭제하거나 무효화 처리
    // 서버에서는 특별히 할 작업이 없지만, 클라이언트가 로그아웃을 인식하도록 응답을 보냄
    res.json({ message: 'Logout successful' });
};
