/*
=========================================================
SQL SCHEMA FOR SUPABASE (POSTGRESQL)
Copy and run this in the Supabase SQL Editor:
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
