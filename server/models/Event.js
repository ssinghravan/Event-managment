import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, enum: ['Community', 'Environment', 'Education', 'Health', 'Animals'] },
    image: { type: String },
    budget: { type: Number },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    bannerUrl: { type: String },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
