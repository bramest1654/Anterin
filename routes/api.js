const express = require('express');
const router = express.Router();
const {
    getBlockedDatesForMonth,
    createBooking
} = require('../db/database');

// GET /api/availability/:year/:month
// Returns blocked dates for a specific month
router.get('/availability/:year/:month', async (req, res) => {
    try {
        const { year, month } = req.params;
        const blockedDates = await getBlockedDatesForMonth(parseInt(year), parseInt(month));
        res.json({ success: true, blockedDates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/bookings
// Create a new booking and return WhatsApp redirect URL
router.post('/bookings', async (req, res) => {
    try {
        const { nama, tgl_mulai, tgl_selesai, lokasi_jemput } = req.body;

        // Validation
        if (!nama || !tgl_mulai || !tgl_selesai || !lokasi_jemput) {
            return res.status(400).json({ success: false, error: 'Semua field wajib diisi.' });
        }

        if (new Date(tgl_mulai) > new Date(tgl_selesai)) {
            return res.status(400).json({ success: false, error: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.' });
        }

        // Save booking
        const result = await createBooking(nama, tgl_mulai, tgl_selesai, lokasi_jemput);

        // Build WhatsApp message
        const message = `Halo Anterin, saya ingin menyewa unit Innova Zenix Tipe G Bensin dengan Pak Surono. Berikut detail pesanan saya:\n\nNama: ${nama}\nTanggal: ${tgl_mulai} s/d ${tgl_selesai}\nLokasi Jemput: ${lokasi_jemput}\n\nMohon konfirmasi ketersediaan jadwalnya ya. Terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/6281227539199?text=${encodedMessage}`;

        res.json({
            success: true,
            bookingId: result.lastInsertRowid,
            waUrl
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
