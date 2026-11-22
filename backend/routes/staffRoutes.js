
import express from 'express';

import {
    protect,
    authorize
} from '../middleware/authMiddleware.js';

import {
    getAssignedComplaints,
    updateStaffComplaintStatus
} from '../controllers/staffController.js';

const router = express.Router();

// Staff: View assigned complaints
router.get(
    '/complaints',
    protect,
    authorize('staff'),
    getAssignedComplaints
);

// Staff: Update complaint status
router.patch(
    '/complaints/:id/status',
    protect,
    authorize('staff'),
    updateStaffComplaintStatus
);

export default router;
