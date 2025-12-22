import Event from '../models/Event.js';
import { mockDb } from '../utils/mockDb.js';
import mongoose from 'mongoose';

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Get all events
export const getEvents = async (req, res) => {
    try {
        let events;
        if (isMongoConnected()) {
            events = await Event.find().sort({ date: 1 });
        } else {
            events = await mockDb.events.find();
            // Sort in memory for mock db
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get single event
export const getEventById = async (req, res) => {
    try {
        let event;
        if (isMongoConnected()) {
            event = await Event.findById(req.params.id);
        } else {
            event = await mockDb.events.findById(req.params.id);
        }

        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Create event
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, image } = req.body;

        // Basic validation
        if (!title || !date || !location) {
            return res.status(400).json({ message: 'Please provide title, date, and location' });
        }

        // Handle image - either from URL or uploaded file
        let imageUrl = image; // Default to URL if provided

        if (req.file) {
            // If file was uploaded, use the file path
            imageUrl = `/uploads/${req.file.filename}`;
        }

        let event;
        if (isMongoConnected()) {
            event = new Event({
                title,
                description,
                date,
                location,
                category,
                image: imageUrl,
                organizer: req.user.id // Assumes auth middleware adds user to req
            });
            await event.save();
        } else {
            event = await mockDb.events.create({
                title,
                description,
                date,
                location,
                category,
                image: imageUrl,
                organizer: req.user.id
            });
        }

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        let event;
        if (isMongoConnected()) {
            event = await Event.findById(req.params.id);
        } else {
            event = await mockDb.events.findById(req.params.id);
        }

        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check ownership (simple check)
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (isMongoConnected()) {
            event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        } else {
            event = await mockDb.events.findByIdAndUpdate(req.params.id, req.body);
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        let event;
        if (isMongoConnected()) {
            event = await Event.findById(req.params.id);
        } else {
            event = await mockDb.events.findById(req.params.id);
        }

        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check ownership
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (isMongoConnected()) {
            await event.deleteOne();
        } else {
            await mockDb.events.findByIdAndDelete(req.params.id);
        }

        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
