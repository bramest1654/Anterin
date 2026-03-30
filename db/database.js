/*
=========================================================
SQL SCHEMA FOR SUPABASE (POSTGRESQL)
Copy and run this in the Supabase SQL Editor when ready:
=========================================================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    nama TEXT NOT NULL,
    tgl_mulai DATE NOT NULL,
    tgl_selesai DATE NOT NULL,
    lokasi_jemput TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    wa_sent SMALLINT DEFAULT 1
);

CREATE TABLE blocked_dates (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    reason TEXT DEFAULT 'booked'
);
=========================================================
*/

// MOCK SIMULATION MODE (LOCAL DEBUGGING)
// Karena `.env` Supabase belum di-setup, kita pakai MOCK Database
// agar `localhost:3000` bisa dirender sempurna tanpa error (Crash).

const getAllBookings = async () => [];
const getBookingsByStatus = async () => [];

const createBooking = async (nama, tgl_mulai, tgl_selesai, lokasi_jemput) => {
    console.log(`[SIMULASI] Booking baru: ${nama} (${tgl_mulai} - ${tgl_selesai})`);
    return { lastInsertRowid: Math.floor(Math.random() * 1000) };
};

const updateBookingStatus = async () => true;
const cancelBooking = async () => true;

const getBlockedDatesForMonth = async (year, month) => {
    // Memberikan 1 contoh dummy hari libur untuk membuktikan Kalender Interaktif bekerja
    const currentMonthStr = String(month).padStart(2, '0');
    return [
        { date: `${year}-${currentMonthStr}-15`, reason: 'manual_block' },
        { date: `${year}-${currentMonthStr}-16`, reason: 'manual_block' }
    ];
};

const blockDate = async () => true;
const unblockDate = async () => true;
const blockDateRange = async () => true;
const unblockDateRange = async () => true;

const getStats = async () => ({
    totalAll: 15,
    totalMonth: 5,
    pending: 2,
    confirmed: 3
});

module.exports = {
    // Tidak me-route ke Supabase dulu, full statis untuk debug
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
