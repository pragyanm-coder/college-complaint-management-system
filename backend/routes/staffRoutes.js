
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Staff: View assigned complaints
router.get('/complaints', protect, authorize('staff'), (req, res) => {
    res.json({
        success: true,
        message: 'Staff complaints endpoint working'
    });
});

// Staff: Update complaint progress
router.patch('/complaints/:id/status', protect, authorize('staff'), (req, res) => {
    res.json({
        success: true,
        message: 'Staff status update endpoint working',
        complaintId: req.params.id
    });
});

export default router;