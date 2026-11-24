

import 'dotenv/config';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/authUtils.js';

const createTestUsers = async () =>
{
    try
    {
        await connectDB();

        const adminPassword = process.env.ADMIN_PASSWORD;
        const staffPassword = process.env.STAFF_PASSWORD;

        if(!adminPassword || !staffPassword)
        {
            throw new Error('Admin or staff password is missing');
        }

        const admin = await User.findOneAndUpdate(
        {
            email: 'admin.test@example.com'
        },
        {
            $set:
            {
                fullName: 'Test Admin',
                password: await hashPassword(adminPassword),
                role: 'admin'
            }
        },
        {
            returnDocument: 'after',
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        });

        const staff = await User.findOneAndUpdate(
        {
            email: 'staff.test@example.com'
        },
        {
            $set:
            {
                fullName: 'Test Staff',
                password: await hashPassword(staffPassword),
                role: 'staff',
                handlingDepartment: 'Maintenance Department'
            }
        },
        {
            returnDocument: 'after',
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        });

        console.log('Test accounts created successfully');
        console.log('Admin:', admin.email, admin.role);
        console.log('Staff:', staff.email, staff.role);
    }
    catch(error)
    {
        console.error('Account creation failed:', error.message);
        process.exitCode = 1;
    }
    finally
    {
        await mongoose.disconnect();
    }
};

createTestUsers();
