

import {
    createComplaint,
    getMyComplaints,
    getComplaintById
} from '../controllers/complaintController.js';

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

// View a particular complaint
router.get(
    '/:id',
    protect,
    getComplaintById
);