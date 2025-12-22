import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: [{ type: String }],
    availability: { type: String },
    assignedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Volunteer', volunteerSchema);
