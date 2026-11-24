
import express from 'express';

import {
    validateRegister,
    validateLogin
} from '../validators/authValidator.js';

import {
    registerUser,
    loginUser
} from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', validateRegister, registerUser);

// Login an existing user
router.post('/login', validateLogin, loginUser);

export default router;
