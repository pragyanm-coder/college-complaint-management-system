
import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res, next) =>
{
    try
    {
        const { title, description, category, location } = req.body;

        const complaint = await Complaint.create(
        {
            title: title.trim(),
            description: description.trim(),
            category,
            location: location.trim(),
            student: req.user.id,
            priority: 'Medium',
            status: 'Pending',
            updates:
            [
                {
                    type: 'Submitted',
                    author: req.user.id,
                    text: 'Complaint submitted successfully'
                }
            ]
        });

        return res.status(201).json(
        {
            success: true,
            message: 'Complaint submitted successfully',
            data: complaint
        });
    }
    catch(error)
    {
        next(error);
    }
};


export const getMyComplaints = async (req, res, next) =>
{
    try
    {
        const complaints = await Complaint.find(
        {
            student: req.user.id
        })
        .sort({ createdAt: -1 })
        .populate('assignedStaff', 'fullName email handlingDepartment');

        return res.status(200).json(
        {
            success: true,
            count: complaints.length,
            data: complaints
        });
    }
    catch(error)
    {
        next(error);
    }
};


export const getComplaintById = async (req, res, next) =>
{
    try
    {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id))
        {
            return res.status(400).json(
            {
                success: false,
                message: 'Invalid complaint ID'
            });
        }

        const complaint = await Complaint.findById(id)
            .populate('student', 'fullName email rollNumber department')
            .populate('assignedStaff', 'fullName email handlingDepartment')
            .populate('updates.author', 'fullName role');

        if(!complaint)
        {
            return res.status(404).json(
            {
                success: false,
                message: 'Complaint not found'
            });
        }

        if(req.user.role === 'student' &&
           complaint.student._id.toString() !== req.user.id)
        {
            return res.status(403).json(
            {
                success: false,
                message: 'You cannot access this complaint'
            });
        }

        if(req.user.role === 'staff' &&
           (!complaint.assignedStaff ||
            complaint.assignedStaff._id.toString() !== req.user.id))
        {
            return res.status(403).json(
            {
                success: false,
                message: 'You cannot access this complaint'
            });
        }

        return res.status(200).json(
        {
            success: true,
            data: complaint
        });
    }
    catch(error)
    {
        next(error);
    }
};
