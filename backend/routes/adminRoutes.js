
import {
    validateAssignment,
    validateAdminStatus
} from '../validators/complaintActionValidator.js';
import express from 'express';

import {
    protect,
    authorize
} from '../middleware/authMiddleware.js';

import {
    getAllComplaints,
    assignComplaint,
    updateComplaintStatus
} from '../controllers/adminController.js';

const router = express.Router();

// Admin: View all complaints
router.get(
    '/complaints',
    protect,
    authorize('admin'),
    getAllComplaints
);

// Admin: Assign complaint to staff
router.patch(
    '/complaints/:id/assign',
    protect,
    authorize('admin'),
    validateAssignment,
    assignComplaint
);

// Admin: Update complaint status
router.patch(
    '/complaints/:id/status',
    protect,
    authorize('admin'),
    validateAdminStatus,
    updateComplaintStatus
);

export default router;
