import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockDb } from '../utils/mockDb.js';


const router = express.Router();

const isMongoConnected = () => mongoose.connection.readyState === 1;


// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        let user;

        if (isMongoConnected()) {
            user = await User.findOne({ email });
        } else {
            user = await mockDb.users.findOne({ email });
        }

        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if this is the first admin (auto-approve first admin)
        let isAdminApproved = true; // Default for volunteers/coordinators
        if (role === 'admin') {
            let adminCount = 0;
            if (isMongoConnected()) {
                adminCount = await User.countDocuments({ role: 'admin', isAdminApproved: true });
            } else {
                const allUsers = await mockDb.users.find();
                adminCount = allUsers.filter(u => u.role === 'admin' && u.isAdminApproved).length;
            }
            // If no approved admins exist, auto-approve this first admin
            isAdminApproved = adminCount === 0;
        }

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            isVerified: true,
            role: role || 'volunteer',
            isAdminApproved
        };

        if (isMongoConnected()) {
            user = new User(userData);
            await user.save();
        } else {
            user = await mockDb.users.create(userData);
        }

        // If admin requires approval, don't issue token yet
        if (user.role === 'admin' && !isAdminApproved) {
            return res.status(201).json({
                message: 'Registration successful! Your admin request is pending approval. Please wait for an existing admin to approve your request before you can sign in.',
                requiresApproval: true
            });
        }

        // Issue token and log user in directly
        const token = jwt.sign({ id: user._id || user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, image: user.image } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user;

        if (isMongoConnected()) {
            user = await User.findOne({ email });
        } else {
            console.log('MongoDB not connected. Using Mock DB.');
            user = await mockDb.users.findOne({ email });
        }

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });



        // Check if admin is approved
        if (user.role === 'admin' && !user.isAdminApproved) {
            return res.status(403).json({ message: 'Your admin request is pending approval. Please wait for an existing admin to approve your request.' });
        }

        const token = jwt.sign({ id: user._id || user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, image: user.image, isAdminApproved: user.isAdminApproved } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

import { upload } from '../middleware/upload.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update Profile
router.put('/profile', upload.single('image'), async (req, res) => {
    try {
        console.log('Profile update request received');
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, phone } = req.body;
        let image = req.body.image;

        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        let user;

        const deleteOldImage = (oldImageUrl) => {
            if (oldImageUrl && oldImageUrl.includes('/uploads/')) {
                const oldFilename = oldImageUrl.split('/uploads/')[1];
                const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlink(oldFilePath, (err) => {
                        if (err) console.error('Error deleting old image:', err);
                        else console.log('Old image deleted:', oldFilename);
                    });
                }
            }
        };

        if (isMongoConnected()) {
            user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (req.file) deleteOldImage(user.image);

            user.name = name || user.name;
            user.phone = phone || user.phone;
            if (image) user.image = image;
            await user.save();
        } else {
            console.log('MongoDB not connected. Using Mock DB.');
            user = await mockDb.users.findById(decoded.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (req.file) deleteOldImage(user.image);

            const updatedUser = { ...user, name: name || user.name, phone: phone || user.phone, image: image || user.image };
            await mockDb.users.update(decoded.id, updatedUser);
            user = updatedUser;
        }

        res.json({ user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, image: user.image } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get pending admin approval requests
router.get('/admin/pending', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let currentUser;

        if (isMongoConnected()) {
            currentUser = await User.findById(decoded.id);
        } else {
            currentUser = await mockDb.users.findById(decoded.id);
        }

        if (!currentUser || currentUser.role !== 'admin' || !currentUser.isAdminApproved) {
            return res.status(403).json({ message: 'Access denied. Only approved admins can view pending requests.' });
        }

        let pendingAdmins;
        if (isMongoConnected()) {
            pendingAdmins = await User.find({ role: 'admin', isAdminApproved: false, isVerified: true });
        } else {
            pendingAdmins = await mockDb.users.findAll({ role: 'admin', isAdminApproved: false, isVerified: true });
        }

        const sanitizedAdmins = pendingAdmins.map(admin => ({
            id: admin._id || admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            createdAt: admin.createdAt
        }));

        res.json({ pendingAdmins: sanitizedAdmins });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Approve admin request
router.put('/admin/approve/:userId', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let currentUser;

        if (isMongoConnected()) {
            currentUser = await User.findById(decoded.id);
        } else {
            currentUser = await mockDb.users.findById(decoded.id);
        }

        if (!currentUser || currentUser.role !== 'admin' || !currentUser.isAdminApproved) {
            return res.status(403).json({ message: 'Access denied. Only approved admins can approve requests.' });
        }

        const { userId } = req.params;
        let targetUser;

        if (isMongoConnected()) {
            targetUser = await User.findById(userId);
            if (!targetUser) return res.status(404).json({ message: 'User not found' });

            targetUser.isAdminApproved = true;
            targetUser.adminApprovedBy = currentUser._id;
            targetUser.adminApprovedAt = new Date();
            await targetUser.save();
        } else {
            targetUser = await mockDb.users.findById(userId);
            if (!targetUser) return res.status(404).json({ message: 'User not found' });

            await mockDb.users.update(userId, {
                ...targetUser,
                isAdminApproved: true,
                adminApprovedBy: currentUser.id,
                adminApprovedAt: new Date()
            });
        }

        res.json({ message: 'Admin request approved successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Reject admin request
router.put('/admin/reject/:userId', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let currentUser;

        if (isMongoConnected()) {
            currentUser = await User.findById(decoded.id);
        } else {
            currentUser = await mockDb.users.findById(decoded.id);
        }

        if (!currentUser || currentUser.role !== 'admin' || !currentUser.isAdminApproved) {
            return res.status(403).json({ message: 'Access denied. Only approved admins can reject requests.' });
        }

        const { userId } = req.params;
        let targetUser;

        if (isMongoConnected()) {
            targetUser = await User.findById(userId);
            if (!targetUser) return res.status(404).json({ message: 'User not found' });

            // Change role back to volunteer or delete the user
            targetUser.role = 'volunteer';
            targetUser.isAdminApproved = true; // Volunteer doesn't need approval
            await targetUser.save();
        } else {
            targetUser = await mockDb.users.findById(userId);
            if (!targetUser) return res.status(404).json({ message: 'User not found' });

            await mockDb.users.update(userId, {
                ...targetUser,
                role: 'volunteer',
                isAdminApproved: true
            });
        }

        res.json({ message: 'Admin request rejected. User downgraded to volunteer.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
