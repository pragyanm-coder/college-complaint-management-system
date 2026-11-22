
import express from 'express';

import {
    protect,
    authorize
} from '../middleware/authMiddleware.js';

import {
    validateComplaint
} from '../validators/complaintValidator.js';

import {
    createComplaint,
    getMyComplaints,
    getComplaintById
} from '../controllers/complaintController.js';

const router = express.Router();

// Student: Submit a complaint
router.post(
    '/',
    protect,
    authorize('student'),
    validateComplaint,
    createComplaint
);

// Student: View own complaints
router.get(
    '/my',
    protect,
    authorize('student'),
    getMyComplaints
);

// Admin: View all complaints
router.get(
    '/admin/all',
    protect,
    authorize('admin'),
    (req, res) => {
        res.json({
            success: true,
            message: 'All complaints endpoint working'
        });
    }
);

// Staff: View assigned complaints
router.get(
    '/staff/assigned',
    protect,
    authorize('staff'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Assigned complaints endpoint working'
        });
    }
);

// View a particular complaint
router.get(
    '/:id',
    protect,
    getComplaintById
);

export default router;
