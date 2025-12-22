import User from '../models/User.js';
import Event from '../models/Event.js';
import Task from '../models/Task.js';
import { mockDb } from '../utils/mockDb.js';
import mongoose from 'mongoose';

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const getDashboardStats = async (req, res) => {
    try {
        let stats = {
            totalUsers: 0,
            totalEvents: 0,
            totalVolunteers: 0, // This might need better logic if volunteers are just users with a flag
            totalTasks: 0,
            recentActivity: []
        };

        if (isMongoConnected()) {
            stats.totalUsers = await User.countDocuments();
            stats.totalEvents = await Event.countDocuments();
            stats.totalTasks = await Task.countDocuments();

            // For volunteers, let's assume it's the count of unique users in event.volunteers
            // Or if we have a Volunteer model (we don't really, it's just a schema concept in plan).
            // Let's just count users for now as a proxy or count distinct volunteers across events.
            // A better metric might be "Active Volunteers" (users who have volunteered for at least 1 event).
            // For simplicity in this iteration:
            const events = await Event.find().select('volunteers');
            const uniqueVolunteers = new Set();
            events.forEach(e => e.volunteers.forEach(v => uniqueVolunteers.add(v.toString())));
            stats.totalVolunteers = uniqueVolunteers.size;

            // Mock recent activity
            stats.recentActivity = [
                { id: 1, text: 'New user registered', time: '2 mins ago' },
                { id: 2, text: 'Event "City Cleanup" created', time: '1 hour ago' },
                { id: 3, text: '5 new volunteers joined', time: '3 hours ago' }
            ];

        } else {
            const db = mockDb;
            // We need to access the raw data from mockDb
            // Since mockDb exposes methods, we might need to add a 'count' method or just fetch all.
            // Let's use the find methods we added.
            const users = await mockDb.users.find();
            const events = await mockDb.events.find();
            const tasks = await mockDb.tasks.find();

            stats.totalUsers = users.length;
            stats.totalEvents = events.length;
            stats.totalTasks = tasks.length;

            const uniqueVolunteers = new Set();
            events.forEach(e => (e.volunteers || []).forEach(v => uniqueVolunteers.add(v.toString())));
            stats.totalVolunteers = uniqueVolunteers.size;

            stats.recentActivity = [
                { id: 1, text: 'New user registered', time: '2 mins ago' },
                { id: 2, text: 'Event "City Cleanup" created', time: '1 hour ago' },
                { id: 3, text: '5 new volunteers joined', time: '3 hours ago' }
            ];
        }

        res.json(stats);
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
