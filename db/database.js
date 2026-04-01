const { createClient } = require('@supabase/supabase-js');

// SUPABASE CONFIGURATION
// Ensure ini diset di Vercel/Environment settings
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Fail-safe: Jika key tidak ada, gunakan Mock Mode (untuk debug lokal tanpa crash)
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ SUPABASE_URL atau SUPABASE_ANON_KEY tidak ditemukan! Berjalan dalam Mode Mock.');
}

const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * OPERASI TABEL BOOKINGS
 */

const getAllBookings = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Gagal mengambil data booking:', error);
        return [];
    }
    return data;
};

const getBookingsByStatus = async (status) => {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
};

const createBooking = async (nama, tgl_mulai, tgl_selesai, lokasi_jemput) => {
    if (!supabase) {
        console.log(`[MOCK] Berhasil membuat booking untuk ${nama}`);
        return { id: Math.floor(Math.random() * 9999) };
    }
    const { data, error } = await supabase
        .from('bookings')
        .insert([{
            nama,
            tgl_mulai,
            tgl_selesai,
            lokasi_jemput,
            status: 'pending'
        }])
        .select();
    
    if (error) throw error;
    return data[0];
};

const updateBookingStatus = async (id, status) => {
    if (!supabase) return true;
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
    
    if (error) throw error;
    return true;
};

const cancelBooking = async (id) => {
    return updateBookingStatus(id, 'cancelled');
};

/**
 * OPERASI TABEL BLOCKED_DATES (Sinkronisasi Kalender)
 */

const getBlockedDatesForMonth = async (year, month) => {
    if (!supabase) {
        // Fallback mock untuk testing lokal
        const mm = String(month).padStart(2, '0');
        // Contoh default data terisi agar UI terlihat hidup
        return [
            { date: `${year}-${mm}-15`, reason: 'booked' },
            { date: `${year}-${mm}-16`, reason: 'booked' }
        ];
    }

    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = `${year}-${String(month).padStart(2, '0')}-31`; 

    const { data, error } = await supabase
        .from('blocked_dates')
        .select('date, reason')
        .gte('date', firstDay)
        .lte('date', lastDay);
    
    if (error) {
        console.error('Gagal menarik data jadwal terisi:', error);
        return [];
    }
    return data;
};

const blockDate = async (date, reason = 'booked') => {
    if (!supabase) return true;
    const { error } = await supabase
        .from('blocked_dates')
        .upsert([{ date, reason }]);
    
    if (error) throw error;
    return true;
};

const unblockDate = async (date) => {
    if (!supabase) return true;
    const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('date', date);
    
    if (error) throw error;
    return true;
};

/**
 * STATISTIK DASHBOARD
 */

const getStats = async () => {
    if (!supabase) return { totalAll: 0, totalMonth: 0, pending: 0, confirmed: 0 };
    
    const { data: bookings, error } = await supabase.from('bookings').select('status');
    if (error) return { totalAll: 0, totalMonth: 0, pending: 0, confirmed: 0 };

    return {
        totalAll: bookings.length,
        totalMonth: bookings.length, 
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length
    };
};

module.exports = {
    getAllBookings,
    getBookingsByStatus,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getBlockedDatesForMonth,
    blockDate,
    unblockDate,
    getStats
};
