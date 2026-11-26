
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


// Student: Confirm resolution and submit rating/feedback
export const confirmResolution = async (req, res, next) =>
{
    try
    {
        const { id } = req.params;
        const { rating, feedback } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id))
        {
            return res.status(400).json(
            {
                success: false,
                message: 'Invalid complaint ID'
            });
        }

        if(!Number.isInteger(rating) || rating < 1 || rating > 5)
        {
            return res.status(400).json(
            {
                success: false,
                message: 'Rating must be an integer between 1 and 5'
            });
        }

        if(feedback !== undefined &&
           (typeof feedback !== 'string' || feedback.trim().length > 1000))
        {
            return res.status(400).json(
            {
                success: false,
                message: 'Feedback must be a string of at most 1000 characters'
            });
        }

        const complaint = await Complaint.findById(id);

        if(!complaint)
        {
            return res.status(404).json(
            {
                success: false,
                message: 'Complaint not found'
            });
        }

        if(complaint.student.toString() !== req.user.id)
        {
            return res.status(403).json(
            {
                success: false,
                message: 'You cannot update this complaint'
            });
        }

        if(complaint.status !== 'Resolved')
        {
            return res.status(409).json(
            {
                success: false,
                message: 'Only resolved complaints can be confirmed'
            });
        }

        if(complaint.studentConfirmed)
        {
            return res.status(409).json(
            {
                success: false,
                message: 'You have already confirmed this resolution'
            });
        }

        complaint.studentConfirmed = true;
        complaint.rating = rating;
        complaint.feedback = feedback?.trim() || null;

        complaint.updates.push(
        {
            type: 'Comment',
            author: req.user.id,
            text: `Student confirmed the resolution and gave a rating of ${rating}/5.`
        });

        await complaint.save();

        return res.status(200).json(
        {
            success: true,
            message: 'Resolution confirmed successfully',
            data: complaint
        });
    }
    catch(error)
    {
        next(error);
    }
};


// Student: Reopen a resolved complaint
export const reopenComplaint = async (req, res, next) =>
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

        const complaint = await Complaint.findById(id);

        if(!complaint)
        {
            return res.status(404).json(
            {
                success: false,
                message: 'Complaint not found'
            });
        }

        if(complaint.student.toString() !== req.user.id)
        {
            return res.status(403).json(
            {
                success: false,
                message: 'You cannot update this complaint'
            });
        }

        if(complaint.status !== 'Resolved')
        {
            return res.status(409).json(
            {
                success: false,
                message: 'Only resolved complaints can be reopened'
            });
        }

        if(complaint.studentConfirmed)
        {
            return res.status(409).json(
            {
                success: false,
                message: 'A confirmed resolution cannot be reopened'
            });
        }

        complaint.status = 'In Progress';
        complaint.resolvedAt = null;
        complaint.resolutionDetails = null;
        complaint.studentConfirmed = false;
        complaint.rating = null;
        complaint.feedback = null;

        complaint.updates.push(
        {
            type: 'Status Changed',
            author: req.user.id,
            text: 'Student reopened the complaint because the issue has not been resolved. Status changed to In Progress.'
        });

        await complaint.save();

        return res.status(200).json(
        {
            success: true,
            message: 'Complaint reopened successfully',
            data: complaint
        });
    }
    catch(error)
    {
        next(error);
    }
};
