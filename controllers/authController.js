import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ id: userId });
    if(!user) return res.status(404).json({ message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin || false }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: "Logged out" });
};
