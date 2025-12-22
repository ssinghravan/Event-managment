import Task from '../models/Task.js';
import { mockDb } from '../utils/mockDb.js';
import mongoose from 'mongoose';

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, eventId, assignedTo, dueDate } = req.body;

        if (isMongoConnected()) {
            const newTask = new Task({
                title,
                description,
                event: eventId,
                assignedTo,
                dueDate
            });
            await newTask.save();
            res.status(201).json(newTask);
        } else {
            const newTask = await mockDb.tasks.create({
                title,
                description,
                event: eventId,
                assignedTo,
                dueDate
            });
            res.status(201).json(newTask);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get tasks for an event
export const getEventTasks = async (req, res) => {
    try {
        const { eventId } = req.params;
        let tasks;

        if (isMongoConnected()) {
            tasks = await Task.find({ event: eventId }).populate('assignedTo', 'name email');
        } else {
            tasks = await mockDb.tasks.find({ event: eventId });
            // Manually populate assignedTo if needed, but for now just return IDs or basic mock handling
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get tasks assigned to the current user
export const getUserTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        let tasks;

        if (isMongoConnected()) {
            tasks = await Task.find({ assignedTo: userId }).populate('event', 'title date');
        } else {
            tasks = await mockDb.tasks.find({ assignedTo: userId });
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let task;
        if (isMongoConnected()) {
            task = await Task.findByIdAndUpdate(id, { status }, { new: true });
        } else {
            task = await mockDb.tasks.findByIdAndUpdate(id, { status });
        }

        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
