// Admin Dashboard Logic
const params = new URLSearchParams(window.location.search);
const PW = params.get('pw');

// Security Guard: Check if PW exists
if (!PW) {
    window.location.href = '/admin/login.html';
}

const API = (path) => `/admin/api${path}?pw=${PW}`;

// --- Dynamic Greeting ---
function updateGreeting() {
    const hours = new Date().getHours();
    const greetingEl = document.getElementById('adminGreeting');
    let msg = 'Selamat Malam';
    
    if (hours >= 5 && hours < 11) msg = 'Selamat Pagi';
    else if (hours >= 11 && hours < 15) msg = 'Selamat Siang';
    else if (hours >= 15 && hours < 18) msg = 'Selamat Sore';
    
    greetingEl.innerHTML = `${msg}, <span style="color:var(--accent-gold)">Admin Anterin!</span>`;
}

// --- Logout ---
document.getElementById('btnLogout').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.clear();
        window.location.href = '/';
    }
});

// --- Stats ---
async function loadStats() {
    try {
        const res = await fetch(API('/stats'));
        const data = await res.json();
        document.getElementById('statTotal').textContent = data.totalAll;
        document.getElementById('statMonth').textContent = data.totalMonth;
        document.getElementById('statPending').textContent = data.pending;
        document.getElementById('statConfirmed').textContent = data.confirmed;
    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}

// --- Calendar ---
let calYear, calMonth;
let blockedSet = new Set();

function initCalendar() {
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
    renderCalendar();
}

async function renderCalendar() {
    const grid = document.getElementById('calGrid');
    const label = document.getElementById('calMonthYear');
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    label.textContent = `${months[calMonth]} ${calYear}`;
    grid.innerHTML = '';

    // Fetch blocked dates
    try {
        const res = await fetch(API(`/blocked/${calYear}/${calMonth + 1}`));
        const data = await res.json();
        blockedSet = new Set(data.blockedDates.map(d => d.date));
    } catch { blockedSet = new Set(); }

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.classList.add('cal-day', 'empty');
        grid.appendChild(el);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const el = document.createElement('div');
        el.classList.add('cal-day');
        el.textContent = day;

        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(calYear, calMonth, day);

        if (dateObj < today) {
            el.classList.add('past');
        } else {
            if (blockedSet.has(dateStr)) {
                el.classList.add('blocked');
            }
            el.addEventListener('click', () => toggleBlock(dateStr, el));
        }

        grid.appendChild(el);
    }
}

async function toggleBlock(dateStr, el) {
    if (el.classList.contains('past')) return;

    try {
        if (blockedSet.has(dateStr)) {
            // Unblock
            await fetch(API(`/block-date/${dateStr}`), { method: 'DELETE' });
            blockedSet.delete(dateStr);
            el.classList.remove('blocked');
        } else {
            // Block
            await fetch(API('/block-date'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateStr, reason: 'manual' })
            });
            blockedSet.add(dateStr);
            el.classList.add('blocked');
        }
    } catch (err) {
        console.error('Toggle block failed:', err);
    }
}

document.getElementById('calPrev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
});

document.getElementById('calNext').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
});

// --- Bookings ---
async function loadBookings() {
    const container = document.getElementById('bookingsTable');
    try {
        const res = await fetch(API('/bookings'));
        const data = await res.json();

        if (!data.bookings || data.bookings.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-inbox" style="font-size:2rem;margin-bottom:12px;display:block;color:var(--text-secondary)"></i>Belum ada booking.</div>';
            return;
        }

        container.innerHTML = data.bookings.map(b => `
            <div class="booking-card">
                <div class="booking-row-top">
                    <span class="booking-name">${b.nama}</span>
                    <span class="badge ${b.status}">${b.status}</span>
                </div>
                <div class="booking-details">
                    <span><i class="fa-solid fa-calendar"></i> ${b.tgl_mulai} s/d ${b.tgl_selesai}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${b.lokasi_jemput}</span>
                    <span><i class="fa-solid fa-phone"></i> ${b.whatsapp || '-'}</span>
                </div>
                <div class="booking-actions">
                    ${b.status === 'pending' ? `<button class="status-btn active-status" onclick="setStatus(${b.id}, 'confirmed')"><i class="fa-solid fa-check"></i> Konfirmasi</button>` : ''}
                    ${b.status !== 'cancelled' ? `<button class="status-btn cancel" onclick="setStatus(${b.id}, 'cancelled')"><i class="fa-solid fa-trash-can"></i> Batalkan</button>` : ''}
                </div>
            </div>
        `).join('');

    } catch (err) {
        container.innerHTML = '<div class="empty-state">Gagal memuat data.</div>';
    }
}

async function setStatus(id, status) {
    try {
        await fetch(API(`/bookings/${id}`), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        loadBookings();
        loadStats();
        renderCalendar();
    } catch (err) {
        alert('Gagal update status: ' + err.message);
    }
}

// Make setStatus globally accessible
window.setStatus = setStatus;

// --- Init ---
updateGreeting();
loadStats();
initCalendar();
loadBookings();

