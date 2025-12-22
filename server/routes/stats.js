import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// Protected route, Admin only
// For now, we might relax the 'admin' check if we haven't seeded an admin user yet,
// but let's keep it for correctness and maybe seed an admin.
// Or we can just use 'auth' for now to demonstrate.
// Let's use 'auth' only for this demo to ensure the user can see it without complex seeding.
// TODO: Uncomment 'admin' middleware when admin user seeding is robust.
router.get('/dashboard', auth, admin, getDashboardStats);

export default router;
