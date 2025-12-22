import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);
