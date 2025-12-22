import express from 'express';
import Contact from '../models/Contact.js';
import { sendContactNotification } from '../utils/emailService.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new contact entry
        const contact = new Contact({
            name,
            email,
            message
        });

        // Save to database
        await contact.save();

        // Send email notification to admin
        const emailSent = await sendContactNotification({ name, email, message });

        if (!emailSent) {
            console.warn('Contact saved but email notification failed');
        }

        res.status(201).json({
            message: 'Thank you for contacting us! We will get back to you soon.',
            success: true
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            message: 'Failed to submit contact form. Please try again later.',
            success: false
        });
    }
});

// Get all contacts (for admin dashboard - optional)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
});

export default router;
