
import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';

// Staff: View complaints assigned to them
export const getAssignedComplaints = async (req, res, next) =>
{
    try
    {
        const complaints = await Complaint.find(
        {
            assignedStaff: req.user.id
        })
        .populate('student', 'fullName email rollNumber department')
        .populate('assignedStaff', 'fullName email handlingDepartment')
        .sort({ createdAt: -1 });

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


// Staff: Update status of assigned complaint
export const updateStaffComplaintStatus = async (req, res, next) =>
{
    try
    {
        const { id } = req.params;
        const { status, resolutionDetails } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id))
        {
            return res.status(400).json(
            {
                success: false,
                message: 'Invalid complaint ID'
            });
        }

        const complaint = await Complaint.findOne(
        {
            _id: id,
            assignedStaff: req.user.id
        });

        if(!complaint)
        {
            return res.status(404).json(
            {
                success: false,
                message: 'Complaint not found or not assigned to you'
            });
        }

       const allowedTransitions =
{
    'Pending': ['In Progress'],
    'In Progress': ['Resolved'],
    'Resolved': []
};

if(!allowedTransitions[complaint.status].includes(status))
{
    return res.status(409).json(
    {
        success: false,
        message: `Cannot change status from ${complaint.status} to ${status}`
    });
}

complaint.status = status;

if(status === 'Resolved')
{
    complaint.resolutionDetails = resolutionDetails.trim();
    complaint.resolvedAt = new Date();
}
else
{
    complaint.resolutionDetails = null;
    complaint.resolvedAt = null;
}

        complaint.updates.push(
        {
            type: 'Status Changed',
            author: req.user.id,
            text: status === 'Resolved'
                ? `Complaint resolved: ${resolutionDetails.trim()}`
                : `Complaint status changed to ${status}`
        });

        await complaint.save();

        return res.status(200).json(
        {
            success: true,
            message: 'Complaint status updated successfully',
            data: complaint
        });
    }
    catch(error)
    {
        next(error);
    }
};
