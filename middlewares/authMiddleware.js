const UserModel = require('../models/userModel');

exports.authenticateUser = (req, res, next) => {
    const { userId, password } = req.headers;
    const user = UserModel.findById(userId);
    if (user && user.password === password) {
        req.user = user;
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
