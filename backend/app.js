
import express from 'express';
import cors from 'cors';

import adminRoutes from './routes/adminRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'College Complaint Management System API'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running successfully'
    });
});

// Error handling (must come last)
app.use(notFound);
app.use(errorHandler);

export default app;
