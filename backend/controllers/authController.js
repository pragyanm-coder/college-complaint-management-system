

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register a new user
export const registerUser = async (req, res, next) => {
    try {
        // TODO: Check whether email already exists.
        // TODO: Hash password.
        // TODO: Save user in MongoDB.

        res.status(501).json({
            success: false,
            message: 'Registration logic pending database integration'
        });
    }
    catch (error) {
        next(error);
    }
};

// Login an existing user
export const loginUser = async (req, res, next) => {
    try {
        // TODO: Find user by email.
        // TODO: Compare password using bcrypt.
        // TODO: Generate JWT token.

        res.status(501).json({
            success: false,
            message: 'Login logic pending database integration'
        });
    }
    catch (error) {
        next(error);
    }
};
