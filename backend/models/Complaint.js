
import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema(
{
    type:
    {
        type: String,
        enum:
        [
            'Submitted',
            'Assigned',
            'Reassigned',
            'Status Changed',
            'Comment'
        ],
        default: 'Comment'
    },

    author:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text:
    {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
    },

    date:
    {
        type: Date,
        default: Date.now
    }
},
{
    _id: false
});


// Uploaded complaint attachment schema
const attachmentSchema = new mongoose.Schema(
{
    url:
    {
        type: String,
        required: true
    },

    publicId:
    {
        type: String,
        required: true
    },

    originalName:
    {
        type: String,
        required: true
    },

    mimeType:
    {
        type: String,
        enum:
        [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf'
        ],
        required: true
    },

    size:
    {
        type: Number,
        required: true,
        min: 0
    }
},
{
    _id: false
});


const complaintSchema = new mongoose.Schema(
{
    title:
    {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 120
    },

    description:
    {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 2000
    },

    category:
    {
        type: String,
        enum:
        [
            'Hostel',
            'Classroom and Infrastructure',
            'Library',
            'Canteen',
            'Academics',
            'Transport',
            'IT and Wi-Fi',
            'Other'
        ],
        required: true
    },

    location:
    {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    priority:
    {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },

    status:
    {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },

    student:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    assignedStaff:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    // Complaint photos and documents
    attachments:
    {
        type: [attachmentSchema],
        default: []
    },

    resolutionDetails:
    {
        type: String,
        default: null,
        trim: true,
        maxlength: 1000
    },

    updates:
    {
        type: [updateSchema],
        default: []
    },

    resolvedAt:
    {
        type: Date,
        default: null
    },

    studentConfirmed:
    {
        type: Boolean,
        default: false
    },

    rating:
    {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },

    feedback:
    {
        type: String,
        default: null,
        trim: true,
        maxlength: 1000
    }
},
{
    timestamps: true
});


// Student complaint listing
complaintSchema.index({ student: 1, createdAt: -1 });

// Staff assigned complaint listing
complaintSchema.index({ assignedStaff: 1, status: 1 });

// Admin filtering and sorting
complaintSchema.index({ status: 1, createdAt: -1 });


const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
