import Event from '../models/Event.js';
import User from '../models/User.js';
import { mockDb } from '../utils/mockDb.js';
import mongoose from 'mongoose';

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Volunteer for an event
export const volunteerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        let event;
        if (isMongoConnected()) {
            event = await Event.findById(eventId);
        } else {
            event = await mockDb.events.findById(eventId);
        }

        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if already volunteered
        // Ensure volunteers array exists
        if (!event.volunteers) event.volunteers = [];

        // Check if user ID is already in the list (handling both ObjectId and string)
        const isVolunteered = event.volunteers.some(v => v.toString() === userId);

        if (isVolunteered) {
            return res.status(400).json({ message: 'You have already volunteered for this event' });
        }

        if (isMongoConnected()) {
            event.volunteers.push(userId);
            await event.save();
        } else {
            const updatedVolunteers = [...event.volunteers, userId];
            await mockDb.events.findByIdAndUpdate(eventId, { volunteers: updatedVolunteers });
        }

        res.json({ message: 'Successfully volunteered for the event' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get events user has volunteered for
export const getUserVolunteering = async (req, res) => {
    try {
        const userId = req.user.id;
        let events;

        if (isMongoConnected()) {
            events = await Event.find({ volunteers: userId });
        } else {
            const allEvents = await mockDb.events.find();
            events = allEvents.filter(event =>
                event.volunteers && event.volunteers.some(v => v.toString() === userId)
            );
        }

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get volunteers for an event (Admin/Organizer only)
export const getEventVolunteers = async (req, res) => {
    try {
        const { eventId } = req.params;
        let event;
        let volunteers = [];

        if (isMongoConnected()) {
            event = await Event.findById(eventId).populate('volunteers', 'name email phone');
            volunteers = event ? event.volunteers : [];
        } else {
            event = await mockDb.events.findById(eventId);
            if (event && event.volunteers) {
                // WORKAROUND: For now, let's just return the IDs or basic info if possible.
                volunteers = event.volunteers;
            }
        }

        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all volunteers (Admin only)
export const getAllVolunteers = async (req, res) => {
    try {
        let volunteers;

        if (isMongoConnected()) {
            // Fetch all users, excluding password
            volunteers = await User.find()
                .select('-password')
                .sort({ createdAt: -1 });
        } else {
            // For mock DB, fetch all users
            const allUsers = await mockDb.users.find();
            volunteers = allUsers
                .map(({ password, ...user }) => user); // Exclude sensitive data
        }

        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

