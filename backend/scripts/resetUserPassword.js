

import 'dotenv/config';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/authUtils.js';

const resetPassword = async () =>
{
    try
    {
        const email = 'qa.student1@gmail.com';
        const newPassword = process.env.NEW_USER_PASSWORD;

        if(!newPassword || newPassword.length < 8)
        {
            throw new Error('Set NEW_USER_PASSWORD to a password of at least 8 characters');
        }

        await connectDB();

        const user = await User.findOne({ email });

        if(!user)
        {
            throw new Error('User not found');
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        console.log('Password reset successfully');
        console.log('Email:', user.email);
        console.log('Role:', user.role);
    }
    catch(error)
    {
        console.error('Password reset failed:', error.message);
        process.exitCode = 1;
    }
    finally
    {
        await mongoose.disconnect();
    }
};

resetPassword();
