
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateComplaint } from '../validators/complaintValidator.js';

const router = express.Router();

// Student: Submit a complaint
// Student: Submit a complaint
router.post(
    '/',
    protect,
    authorize('student'),
    validateComplaint,
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Complaint data validated successfully'
        });
    }
);

// Student: View own complaints
router.get('/my', protect, authorize('student'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Your complaints endpoint working'
    });
});

// Admin: View all complaints
router.get('/admin/all', protect, authorize('admin'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'All complaints endpoint working'
    });
});

// Staff: View assigned complaints
router.get('/staff/assigned', protect, authorize('staff'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Assigned complaints endpoint working'
    });
});

// View a particular complaint
router.get('/:id', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Complaint details endpoint working',
        complaintId: req.params.id
    });
});

export default router;