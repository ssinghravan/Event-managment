import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../data/db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'));
}

// Ensure db file exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], events: [], volunteers: [], tasks: [] }, null, 2));
}

const readDb = () => {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

const writeDb = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export const mockDb = {
    users: {
        find: async (query = {}) => {
            const db = readDb();
            if (Object.keys(query).length === 0) return db.users;
            return db.users.filter(u => Object.keys(query).every(key => u[key] === query[key]));
        },
        findOne: async (query) => {
            const db = readDb();
            return db.users.find(u => Object.keys(query).every(key => u[key] === query[key]));
        },
        create: async (userData) => {
            const db = readDb();
            const newUser = { ...userData, _id: Date.now().toString() };
            db.users.push(newUser);
            writeDb(db);
            return newUser;
        },
        findById: async (id) => {
            const db = readDb();
            return db.users.find(u => u._id === id);
        },
        update: async (id, updateData) => {
            const db = readDb();
            const index = db.users.findIndex(u => u._id === id);
            if (index === -1) return null;

            db.users[index] = { ...db.users[index], ...updateData };
            writeDb(db);
            return db.users[index];
        }
    },
    events: {
        find: async () => {
            const db = readDb();
            return db.events;
        },
        findById: async (id) => {
            const db = readDb();
            return db.events.find(e => e._id === id);
        },
        create: async (eventData) => {
            const db = readDb();
            const newEvent = { ...eventData, _id: Date.now().toString(), createdAt: new Date() };
            db.events.push(newEvent);
            writeDb(db);
            return newEvent;
        },
        findByIdAndUpdate: async (id, updateData) => {
            const db = readDb();
            const index = db.events.findIndex(e => e._id === id);
            if (index === -1) return null;

            db.events[index] = { ...db.events[index], ...updateData };
            writeDb(db);
            return db.events[index];
        },
        findByIdAndDelete: async (id) => {
            const db = readDb();
            const index = db.events.findIndex(e => e._id === id);
            if (index === -1) return null;

            const deletedEvent = db.events[index];
            db.events.splice(index, 1);
            writeDb(db);
            return deletedEvent;
        }
    },
    tasks: {
        find: async (query = {}) => {
            const db = readDb();
            if (Object.keys(query).length === 0) return db.tasks || [];
            return (db.tasks || []).filter(t => Object.keys(query).every(key => t[key] === query[key]));
        },
        create: async (taskData) => {
            const db = readDb();
            if (!db.tasks) db.tasks = [];
            const newTask = { ...taskData, _id: Date.now().toString(), status: 'Pending', createdAt: new Date() };
            db.tasks.push(newTask);
            writeDb(db);
            return newTask;
        },
        findByIdAndUpdate: async (id, updateData) => {
            const db = readDb();
            if (!db.tasks) return null;
            const index = db.tasks.findIndex(t => t._id === id);
            if (index === -1) return null;

            db.tasks[index] = { ...db.tasks[index], ...updateData };
            writeDb(db);
            return db.tasks[index];
        }
    }
};
