import express from 'express';
import { createTask, getEventTasks, getUserTasks, updateTaskStatus } from '../controllers/taskController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.post('/', auth, createTask);
router.get('/event/:eventId', auth, getEventTasks);
router.get('/my-tasks', auth, getUserTasks);
router.patch('/:id/status', auth, updateTaskStatus);

export default router;
