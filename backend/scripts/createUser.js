
import 'dotenv/config';
import mongoose from 'mongoose';
import { createInterface } from 'node:readline/promises';

import connectDB from '../config/db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/authUtils.js';

const createUser = async () =>
{
    const rl = createInterface(
    {
        input: process.stdin,
        output: process.stdout
    });

    try
    {
        const fullName = (await rl.question('Full name: ')).trim();
        const email = (await rl.question('Email: ')).trim().toLowerCase();
        const role = (await rl.question('Role (admin/staff): ')).trim().toLowerCase();

        if(!fullName || !email)
        {
            throw new Error('Name and email are required');
        }

        if(!['admin', 'staff'].includes(role))
        {
            throw new Error('Role must be admin or staff');
        }

        let handlingDepartment;

        if(role === 'staff')
        {
            handlingDepartment = (await rl.question('Handling department: ')).trim();

            if(!handlingDepartment)
            {
                throw new Error('Handling department is required for staff');
            }
        }

        const password = await rl.question('Password: ');
        const confirmPassword = await rl.question('Confirm password: ');

        if(password.length < 8)
        {
            throw new Error('Password must contain at least 8 characters');
        }

        if(password !== confirmPassword)
        {
            throw new Error('Passwords do not match');
        }

        await connectDB();

        const existingUser = await User.findOne({ email });

        if(existingUser)
        {
            throw new Error('An account with this email already exists');
        }

        const user = await User.create(
        {
            fullName,
            email,
            role,
            password: await hashPassword(password),
            ...(role === 'staff' && { handlingDepartment })
        });

        console.log('\nAccount created successfully');
        console.log('Name:', user.fullName);
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Password: Set successfully');
    }
    catch(error)
    {
        console.error('\nAccount creation failed:', error.message);
        process.exitCode = 1;
    }
    finally
    {
        rl.close();
        await mongoose.disconnect();
    }
};

createUser();
