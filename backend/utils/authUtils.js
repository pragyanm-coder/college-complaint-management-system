
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Hash password
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};