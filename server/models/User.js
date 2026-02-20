import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    image: { type: String },
    role: { type: String, enum: ['admin', 'volunteer', 'coordinator'], default: 'volunteer' },

    isVerified: { type: Boolean, default: false },
    isAdminApproved: { type: Boolean, default: false },
    adminApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminApprovedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
