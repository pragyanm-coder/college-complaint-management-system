
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
{
    fullName:
    {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },

    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    password:
    {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },

    role:
    {
        type: String,
        enum: ['student', 'admin', 'staff'],
        default: 'student',
        required: true
    },

    rollNumber:
    {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        required: function()
        {
            return this.role === 'student';
        }
    },

    department:
    {
        type: String,
        trim: true,
        required: function()
        {
            return this.role === 'student';
        }
    },

    year:
    {
        type: String,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        required: function()
        {
            return this.role === 'student';
        }
    },

    phone:
    {
        type: String,
        trim: true,
        match: /^\d{10}$/,
        required: function()
        {
            return this.role === 'student';
        }
    },

    handlingDepartment:
    {
        type: String,
        trim: true,
        required: function()
        {
            return this.role === 'staff';
        }
    }
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
