
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
    getComplaintById,
    confirmResolution,
    reopenComplaint
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
// Student: Confirm resolution and submit feedback
router.patch(
    '/:id/confirm',
    protect,
    authorize('student'),
    confirmResolution
);

// Student: Reopen a resolved complaint
router.patch(
    '/:id/reopen',
    protect,
    authorize('student'),
    reopenComplaint
);
// Student: View own complaints
router.get(
    '/my',
    protect,
    authorize('student'),
    getMyComplaints
);

// View a particular complaint
router.get(
    '/:id',
    protect,
    getComplaintById
);

export default router;
