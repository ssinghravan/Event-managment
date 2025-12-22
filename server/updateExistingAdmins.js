import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateExistingAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all admin users
        const admins = await User.find({ role: 'admin' });

        console.log(`Found ${admins.length} admin users:`);
        admins.forEach(admin => {
            console.log(`- ${admin.email}: isAdminApproved=${admin.isAdminApproved}, isVerified=${admin.isVerified}`);
        });

        // Update all existing admins to be approved
        const result = await User.updateMany(
            { role: 'admin' },
            { $set: { isAdminApproved: true } }
        );

        console.log(`\nUpdated ${result.modifiedCount} admin users to isAdminApproved: true`);

        // Show updated admins
        const updatedAdmins = await User.find({ role: 'admin' });
        console.log('\nUpdated admin users:');
        updatedAdmins.forEach(admin => {
            console.log(`- ${admin.email}: isAdminApproved=${admin.isAdminApproved}, isVerified=${admin.isVerified}`);
        });

        await mongoose.disconnect();
        console.log('\nDatabase update complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateExistingAdmins();
