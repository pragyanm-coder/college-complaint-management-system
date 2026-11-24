
import User from '../models/User.js';
import {
    hashPassword,
    comparePassword,
    generateToken
} from '../utils/authUtils.js';

export const registerUser = async (req, res, next) =>
{
    try
    {
        const {
            fullName,
            email,
            password,
            rollNumber,
            department,
            year,
            phone
        } = req.body;

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedRollNumber = rollNumber.trim();

        const existingUser = await User.findOne(
        {
            $or:
            [
                { email: normalizedEmail },
                { rollNumber: normalizedRollNumber }
            ]
        });

        if(existingUser)
        {
            return res.status(409).json(
            {
                success: false,
                message: 'Email or roll number already registered'
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create(
        {
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            rollNumber: normalizedRollNumber,
            department: department.trim(),
            year,
            phone: phone.trim(),
            role: 'student'
        });

        const token = generateToken(user._id, user.role);

        return res.status(201).json(
        {
            success: true,
            message: 'Registration successful',
            data:
            {
                user:
                {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    }
    catch(error)
    {
        if(error.code === 11000)
        {
            return res.status(409).json(
            {
                success: false,
                message: 'Email or roll number already registered'
            });
        }

        next(error);
    }
};

export const loginUser = async (req, res, next) =>
{
    try
    {
        const { email, password } = req.body;

        const user = await User.findOne(
        {
            email: email.trim().toLowerCase()
        }).select('+password');

        if(!user)
        {
            return res.status(401).json(
            {
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await comparePassword(
            password,
            user.password
        );

        if(!isMatch)
        {
            return res.status(401).json(
            {
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id, user.role);

        return res.status(200).json(
        {
            success: true,
            message: 'Login successful',
            data:
            {
                user:
                {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    }
    catch(error)
    {
        next(error);
    }
};
