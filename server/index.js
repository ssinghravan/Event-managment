import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import volunteerRoutes from './routes/volunteers.js';
import taskRoutes from './routes/tasks.js';
import statsRoutes from './routes/stats.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Server config loaded

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/impactflow')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Failed (Using Mock DB)'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
    res.send('ImpactFlow API is running');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ ERROR: Port ${PORT} is already in use!`);
        console.error(`💡 Solution: The cleanup script should have handled this.`);
        console.error(`   If this persists, manually kill the process using port ${PORT}`);
        console.error(`   Windows: netstat -ano | findstr :${PORT} then taskkill /F /PID <PID>`);
        console.error(`   Unix/Mac: lsof -ti:${PORT} then kill -9 <PID>\n`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
const gracefulShutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
        });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('⚠️  Forced shutdown due to timeout');
        process.exit(1);
    }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
