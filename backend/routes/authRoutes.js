
import express from 'express';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

const router = express.Router();

// Registration route
router.post('/register', validateRegister, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Registration data validated successfully'
    });
});

// Login route
router.post('/login', validateLogin, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Login data validated successfully'
    });
});

export default router;