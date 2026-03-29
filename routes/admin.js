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

// Simple admin password (change this!)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'anterin2026';

// Middleware: check admin auth via query param or header
const authCheck = (req, res, next) => {
    const password = req.query.pw || req.headers['x-admin-password'];
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        // If it's a page request, show login form
        if (req.accepts('html')) {
            res.sendFile(path.join(__dirname, '..', 'admin', 'login.html'));
        } else {
            res.status(401).json({ success: false, error: 'Unauthorized' });
        }
    }
};

// GET /admin — serve admin dashboard
router.get('/', authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

// GET /api/admin/stats
router.get('/api/stats', authCheck, (req, res) => {
    try {
        const stats = getStats();
        res.json({ success: true, ...stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/bookings
router.get('/api/bookings', authCheck, (req, res) => {
    try {
        const bookings = getAllBookings();
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PATCH /api/admin/bookings/:id — update status
router.patch('/api/bookings/:id', authCheck, (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'done', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Status tidak valid.' });
        }

        if (status === 'cancelled') {
            cancelBooking(parseInt(id));
        } else {
            updateBookingStatus(parseInt(id), status);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/block-date
router.post('/api/block-date', authCheck, (req, res) => {
    try {
        const { date, reason } = req.body;
        if (!date) return res.status(400).json({ success: false, error: 'Tanggal wajib diisi.' });
        blockDate(date, reason || 'manual');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/block-date/:date
router.delete('/api/block-date/:date', authCheck, (req, res) => {
    try {
        unblockDate(req.params.date);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/blocked/:year/:month
router.get('/api/blocked/:year/:month', authCheck, (req, res) => {
    try {
        const { year, month } = req.params;
        const blockedDates = getBlockedDatesForMonth(parseInt(year), parseInt(month));
        res.json({ success: true, blockedDates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
