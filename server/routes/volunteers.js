import express from 'express';
import { volunteerForEvent, getUserVolunteering, getEventVolunteers, getAllVolunteers } from '../controllers/volunteerController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/all', adminAuth, getAllVolunteers);

// Protected routes
router.post('/:eventId/join', auth, volunteerForEvent);
router.get('/my-events', auth, getUserVolunteering);
router.get('/:eventId', auth, getEventVolunteers);

export default router;

