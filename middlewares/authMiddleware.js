import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const token = req.cookies?.token;  // ✅ 쿠키에서 JWT 가져오기

    if (!token) {
        console.log("🚨 No token found in cookies");
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("🚨 Token verification failed:", error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};
