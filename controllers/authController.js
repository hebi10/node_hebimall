import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await UserModel.findOne({ userId });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // JWT 생성
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // HTTP-Only 쿠키에 JWT 저장
        res.cookie('token', token, {
            httpOnly: true,  // JavaScript에서 접근 불가
            secure: process.env.NODE_ENV === 'production', // HTTPS에서만 사용
            sameSite: 'Strict', // CSRF 방지
            maxAge: 60 * 60 * 1000, // 1시간 후 만료
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
        sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
};
