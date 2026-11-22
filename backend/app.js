
import adminRoutes from './routes/adminRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'College Complaint Management System API'
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running successfully'
    });
});


app.use(notFound);
app.use(errorHandler);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
export default app;
