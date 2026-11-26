
import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

// Admin: View all complaints
export const getAllComplaints = async (req, res, next) =>
{
    try
    {
        const complaints = await Complaint.find()
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

// Admin: Get all staff members
export const getAllStaff = async (req, res, next) =>
{
    try
    {
        const staff = await User.find({ role: 'staff' })
            .select('fullName email handlingDepartment')
            .sort({ fullName: 1 });

        return res.status(200).json(
        {
            success: true,
            count: staff.length,
            data: staff
        });
    }
    catch(error)
    {
        next(error);
    }
};

// Admin: Assign complaint to staff
export const assignComplaint = async (req, res, next) =>
{
    try
    {
        const { id } = req.params;
        const { staffId } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id) ||
           !mongoose.Types.ObjectId.isValid(staffId))
        {
            return res.status(400).json(
            {
                success: false,
                message: 'Invalid complaint ID or staff ID'
            });
        }

        const staff = await User.findOne(
        {
            _id: staffId,
            role: 'staff'
        });

        if(!staff)
        {
            return res.status(404).json(
            {
                success: false,
                message: 'Staff member not found'
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
        if(complaint.status === 'Resolved')
{
    return res.status(409).json(
    {
        success: false,
        message: 'Cannot assign or reassign a resolved complaint'
    });
}

       
const previousStaffId = complaint.assignedStaff;

// Prevent assigning the same staff member again
if(previousStaffId &&
   previousStaffId.toString() === staff._id.toString())
{
    return res.status(200).json(
    {
        success: true,
        message: 'Complaint is already assigned to this staff member',
        data: complaint
    });
}

let updateMessage;

if(previousStaffId)
{
    const previousStaff = await User.findById(previousStaffId);

const previousStaffName = previousStaff
    ? previousStaff.fullName
    : 'previously assigned staff';

updateMessage = `Complaint reassigned from ${previousStaffName} to ${staff.fullName}`;
}
else
{
    updateMessage = `Complaint assigned to ${staff.fullName}`;
}

complaint.assignedStaff = staff._id;

complaint.updates.push(
{
    type: previousStaffId ? 'Reassigned' : 'Assigned',
    author: req.user.id,
    text: updateMessage
});

await complaint.save();


        return res.status(200).json(
        {
            success: true,
            message: 'Complaint assigned successfully',
            data: complaint
        });
    }
    catch(error)
    {
        next(error);
    }
};



// Admin: Update complaint status
export const updateComplaintStatus = async (req, res, next) =>
{
    try
    {
        const { id } = req.params;
        const { status } = req.body;

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

        
const previousStatus = complaint.status;

if(status === 'Resolved' &&
   (!complaint.resolutionDetails ||
    complaint.resolutionDetails.trim().length < 10))
{
    return res.status(409).json(
    {
        success: false,
        message: 'Resolution details are required before resolving a complaint'
    });
}

complaint.status = status;

if(status === 'Resolved')
{
    complaint.resolvedAt = new Date();
}
else
{
    complaint.resolvedAt = null;
    complaint.resolutionDetails = null;
}

        complaint.updates.push(
        {
            type: 'Status Changed',
            author: req.user.id,
            text: `Admin changed complaint status from ${previousStatus} to ${status}`
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
