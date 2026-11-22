
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());

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

export default app;
