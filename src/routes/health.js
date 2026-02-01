/**
 * Health Check Route
 * 
 * GET /api/healthz
 * Returns the database connection status
 */

import express from 'express';
import { connectDB } from '../config/database.js';

const router = express.Router();

/**
 * Health check endpoint
 * Returns 200 if database is connected, 503 otherwise
 */
router.get('/healthz', async (req, res) => {
    try {
        await connectDB();
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Health check failed:', err);
        return res.status(503).json({ ok: false });
    }
});

export default router;
