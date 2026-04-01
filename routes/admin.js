const express = require('express');
const router = express.Router();
const path = require('path');
const {
    getAllBookings,
    updateBookingStatus,
    cancelBooking,
    blockDate,
    unblockDate,
    getBlockedDatesForMonth,
    getStats
} = require('../db/database');

// Admin Password: Priority to Vercel Environment Variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'anterin2026';

// Middleware: Autentikasi Admin via Query atau Headers
const authCheck = (req, res, next) => {
    const password = req.query.pw || req.headers['x-admin-password'];
    
    if (password === ADMIN_PASSWORD) {
        return next();
    }
    
    // Kegagalan Autentikasi
    if (req.accepts('html')) {
        return res.sendFile(path.join(__dirname, '..', 'admin', 'login.html'));
    }
    
    res.status(401).json({ success: false, error: 'Unauthorized Access. Password diperlukan.' });
};

// GET /admin — serve admin dashboard
router.get('/', authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

// GET /api/admin/stats
router.get('/api/stats', authCheck, async (req, res) => {
    try {
        const stats = await getStats();
        res.json({ success: true, ...stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/bookings
router.get('/api/bookings', authCheck, async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PATCH /api/admin/bookings/:id — update status
router.patch('/api/bookings/:id', authCheck, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'done', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Status tidak valid.' });
        }

        if (status === 'cancelled') {
            await cancelBooking(parseInt(id));
        } else {
            await updateBookingStatus(parseInt(id), status);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/block-date
router.post('/api/block-date', authCheck, async (req, res) => {
    try {
        const { date, reason } = req.body;
        if (!date) return res.status(400).json({ success: false, error: 'Tanggal wajib diisi.' });
        await blockDate(date, reason || 'manual');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/block-date/:date
router.delete('/api/block-date/:date', authCheck, async (req, res) => {
    try {
        await unblockDate(req.params.date);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/blocked/:year/:month
router.get('/api/blocked/:year/:month', authCheck, async (req, res) => {
    try {
        const { year, month } = req.params;
        const blockedDates = await getBlockedDatesForMonth(parseInt(year), parseInt(month));
        res.json({ success: true, blockedDates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
