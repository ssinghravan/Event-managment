import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { upload } from '../middleware/upload.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes - add upload.single('image') middleware to handle file uploads
router.post('/', auth, upload.single('image'), createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default router;
