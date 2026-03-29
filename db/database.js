const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create/connect to SQLite database (Supports specific Production paths)
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'anterin.db');

// Ensure directory exists (Important for persistent disk mounts)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        tgl_mulai TEXT NOT NULL,
        tgl_selesai TEXT NOT NULL,
        lokasi_jemput TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        wa_sent INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS blocked_dates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        reason TEXT DEFAULT 'booked'
    );
`);

// --- Query helpers ---

// Get all bookings, newest first
const getAllBookings = () => {
    return db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
};

// Get bookings by status
const getBookingsByStatus = (status) => {
    return db.prepare('SELECT * FROM bookings WHERE status = ?').all(status);
};

// Insert a new booking
const createBooking = (nama, tgl_mulai, tgl_selesai, lokasi_jemput) => {
    const stmt = db.prepare(`
        INSERT INTO bookings (nama, tgl_mulai, tgl_selesai, lokasi_jemput)
        VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(nama, tgl_mulai, tgl_selesai, lokasi_jemput);

    // Auto-block the booked dates
    blockDateRange(tgl_mulai, tgl_selesai, 'booked');

    return result;
};

// Update booking status
const updateBookingStatus = (id, status) => {
    return db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
};

// Cancel booking and unblock its dates
const cancelBooking = (id) => {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (booking) {
        updateBookingStatus(id, 'cancelled');
        unblockDateRange(booking.tgl_mulai, booking.tgl_selesai);
    }
    return booking;
};

// Get all blocked dates for a given month (YYYY-MM format)
const getBlockedDatesForMonth = (year, month) => {
    const monthStr = String(month).padStart(2, '0');
    const pattern = `${year}-${monthStr}-%`;
    return db.prepare('SELECT date, reason FROM blocked_dates WHERE date LIKE ?').all(pattern);
};

// Block a single date
const blockDate = (date, reason = 'manual') => {
    const stmt = db.prepare('INSERT OR IGNORE INTO blocked_dates (date, reason) VALUES (?, ?)');
    return stmt.run(date, reason);
};

// Unblock a single date
const unblockDate = (date) => {
    return db.prepare('DELETE FROM blocked_dates WHERE date = ?').run(date);
};

// Block a range of dates
const blockDateRange = (startDate, endDate, reason = 'booked') => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const insertStmt = db.prepare('INSERT OR IGNORE INTO blocked_dates (date, reason) VALUES (?, ?)');

    const transaction = db.transaction(() => {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            insertStmt.run(dateStr, reason);
        }
    });
    transaction();
};

// Unblock a range of dates
const unblockDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const deleteStmt = db.prepare('DELETE FROM blocked_dates WHERE date = ?');

    const transaction = db.transaction(() => {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            deleteStmt.run(dateStr);
        }
    });
    transaction();
};

// Get quick stats
const getStats = () => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const totalAll = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const totalMonth = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE created_at LIKE ?").get(`${monthStr}%`).count;
    const pending = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'").get().count;
    const confirmed = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").get().count;

    return { totalAll, totalMonth, pending, confirmed };
};

module.exports = {
    db,
    getAllBookings,
    getBookingsByStatus,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getBlockedDatesForMonth,
    blockDate,
    unblockDate,
    blockDateRange,
    unblockDateRange,
    getStats
};
