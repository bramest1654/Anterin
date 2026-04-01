document.addEventListener('DOMContentLoaded', () => {
    // 00. Premium Intro Screen Logic
    const introScreen = document.getElementById('intro-screen');
    const introSessionKey = 'anterin_intro_done_v1';

    if (introScreen) {
        if (!sessionStorage.getItem(introSessionKey)) {
            introScreen.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                introScreen.classList.add('hide');
                document.body.style.overflow = '';
                setTimeout(() => {
                    introScreen.style.display = 'none';
                }, 1000);
                sessionStorage.setItem(introSessionKey, 'true');
            }, 3000);
        } else {
            introScreen.style.display = 'none';
        }
    }

    // 0. Dynamic Greeting
    const greetingEl = document.getElementById('dynamicGreeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        let greeting = 'Selamat Malam';
        if (hour >= 5 && hour < 11) greeting = 'Selamat Pagi';
        else if (hour >= 11 && hour < 15) greeting = 'Selamat Siang';
        else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore';
        greetingEl.textContent = `${greeting}`;
    }


    // 3. Set min date for date inputs to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date();
    const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    dateInputs.forEach(input => {
        input.setAttribute('min', todayStr);
    });

    // 4. Frontend Availability Calendar Logic
    let calYear, calMonth;
    let preloadedBlockedSet = new Set();
    let selectedStartDate = null;
    let selectedEndDate = null;

    function initFrontCalendar() {
        const now = new Date();
        calYear = now.getFullYear();
        calMonth = now.getMonth();
        renderFrontCalendar();
    }

    async function fetchAvailabilityWithFallback(year, month) {
        try {
            const res = await fetch(`/api/availability/${year}/${month}`);
            if (!res.ok) throw new Error('API Offline');
            const data = await res.json();
            if (data.success) {
                return data.blockedDates.map(d => d.date);
            }
        } catch (err) {
            console.warn('Frontend calendar API failed, using mock failover:', err);
            const mockBlockedDates = ['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-20'];
            return mockBlockedDates;
        }
        return [];
    }

    async function renderFrontCalendar() {
        const grid = document.getElementById('frontCalGrid');
        if (!grid) return;

        const label = document.getElementById('frontCalMonthYear');
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        label.textContent = `${months[calMonth]} ${calYear}`;
        grid.innerHTML = '';

        const blockedArr = await fetchAvailabilityWithFallback(calYear, calMonth + 1);
        preloadedBlockedSet = new Set(blockedArr);

        const firstDay = new Date(calYear, calMonth, 1).getDay();
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < firstDay; i++) {
            const el = document.createElement('div');
            el.classList.add('cal-day', 'empty');
            grid.appendChild(el);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const el = document.createElement('div');
            el.classList.add('cal-day');
            el.textContent = day;

            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dateObj = new Date(calYear, calMonth, day);

            if (dateObj < todayDate) {
                el.classList.add('past');
            } else {
                if (preloadedBlockedSet.has(dateStr)) {
                    el.classList.add('blocked');
                    el.style.pointerEvents = 'none';
                } else {
                    el.classList.add('available');
                    el.addEventListener('click', () => {
                        handleDateSelection(dateStr, dateObj);
                    });
                }
            }

            updateDayVisuals(el, dateStr, dateObj);
            grid.appendChild(el);
        }
    }

    function handleDateSelection(dateStr, dateObj) {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            selectedStartDate = { str: dateStr, obj: dateObj };
            selectedEndDate = null;
        } else if (dateObj < selectedStartDate.obj) {
            selectedStartDate = { str: dateStr, obj: dateObj };
        } else {
            selectedEndDate = { str: dateStr, obj: dateObj };
        }

        const inputMulai = document.getElementById('tglMulai');
        const inputSelesai = document.getElementById('tglSelesai');

        if (inputMulai && selectedStartDate) {
            inputMulai.value = selectedStartDate.str;
        }
        if (inputSelesai) {
            inputSelesai.value = selectedEndDate ? selectedEndDate.str : '';
        }

        renderFrontCalendar();
    }

    function updateDayVisuals(el, dateStr, dateObj) {
        if (!selectedStartDate) return;

        if (selectedStartDate.str === dateStr) {
            el.classList.add('selected');
        }

        if (selectedEndDate) {
            if (selectedEndDate.str === dateStr) {
                el.classList.add('selected');
            }
            if (dateObj > selectedStartDate.obj && dateObj < selectedEndDate.obj) {
                el.classList.add('in-range');
            }
        }
    }

    window.getBookedDatesSet = () => preloadedBlockedSet;

    const btnPrev = document.getElementById('frontCalPrev');
    const btnNext = document.getElementById('frontCalNext');

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            calMonth--;
            if (calMonth < 0) { calMonth = 11; calYear--; }
            renderFrontCalendar();
        });

        btnNext.addEventListener('click', () => {
            calMonth++;
            if (calMonth > 11) { calMonth = 0; calYear++; }
            renderFrontCalendar();
        });

        initFrontCalendar();
        window.renderAvailabilityCalendar = renderFrontCalendar;
    }

    // 5. Smart Selection Logic (Harian vs Bulanan)
    const tipeSewaBtns = document.querySelectorAll('#tipeSewaSelector .segment-btn');
    const priceValueText = document.getElementById('priceValueText');
    const groupJam = document.getElementById('groupJam');
    const groupLokasi = document.getElementById('groupLokasi');
    const groupPaket = document.getElementById('groupPaket');
    let currentTipeSewa = 'harian';

    tipeSewaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Toggle
            tipeSewaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTipeSewa = btn.getAttribute('data-value');

            // 5.1. Update Price Analysis (With Fade Animation)
            if (priceValueText) {
                // Phase 1: Fade out
                priceValueText.style.opacity = '0';
                
                setTimeout(() => {
                    // Phase 2: Switch Text
                    if (currentTipeSewa === 'bulanan') {
                        priceValueText.textContent = 'Hubungi Admin (Harga Khusus)';
                    } else {
                        priceValueText.textContent = 'Rp 1.200.000 / Hari';
                    }
                    // Phase 3: Fade in
                    priceValueText.style.opacity = '1';
                }, 200);
            }

            // 5.2. Update Field Visibility
            if (currentTipeSewa === 'bulanan') {
                if (groupJam) groupJam.classList.add('hidden-field');
                if (groupLokasi) groupLokasi.classList.add('hidden-field');
                if (groupPaket) groupPaket.classList.add('hidden-field');
                // Remove required for hidden fields
                const lokasiInput = document.getElementById('lokasi');
                if (lokasiInput) lokasiInput.required = false;
            } else {
                if (groupJam) groupJam.classList.remove('hidden-field');
                if (groupLokasi) groupLokasi.classList.remove('hidden-field');
                if (groupPaket) groupPaket.classList.remove('hidden-field');
                // Restore required
                const lokasiInput = document.getElementById('lokasi');
                if (lokasiInput) lokasiInput.required = true;
            }
        });
    });

    // 5.3. Schedule Availability Validation
    const tglMulaiInput = document.getElementById('tglMulai');
    const tglSelesaiInput = document.getElementById('tglSelesai');
    const errorTglMulai = document.getElementById('errorTglMulai');
    const errorTglSelesai = document.getElementById('errorTglSelesai');
    let isScheduleFull = false;

    function checkScheduleAvailability() {
        const start = tglMulaiInput ? tglMulaiInput.value : '';
        const end = tglSelesaiInput ? tglSelesaiInput.value : '';

        if (!start || !end) {
            resetValidationUI();
            return;
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        
        if (endDate < startDate) {
            resetValidationUI();
            return;
        }

        let hasConflict = false;
        let currentDate = new Date(startDate);

        // Loop through the selected range to check against preloadedBlockedSet
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (preloadedBlockedSet.has(dateStr)) {
                hasConflict = true;
                break;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (hasConflict) {
            isScheduleFull = true;
            showValidationUI();
        } else {
            isScheduleFull = false;
            resetValidationUI();
        }
    }

    function showValidationUI() {
        if (errorTglMulai) {
            errorTglMulai.style.display = 'block';
            errorTglMulai.textContent = 'Waduh, jadwal Innova Zenix kami sudah terisi pada tanggal ini. Silakan pilih tanggal lain atau diskusi jadwal alternatif via WA.';
        }
        if (errorTglSelesai) {
            errorTglSelesai.style.display = 'block';
            errorTglSelesai.textContent = 'Jadwal Innova Zenix kami sudah terisi pada tanggal ini.';
        }
        
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Diskusi Jadwal Alternatif via WA';
            submitBtn.classList.add('btn-warning-state');
            submitBtn.style.background = '#f59e0b'; // Orange Premium
        }

        // Haptic Feedback & Smooth Scroll
        if (navigator.vibrate) navigator.vibrate(50);
        if (errorTglMulai) {
            errorTglMulai.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function resetValidationUI() {
        if (errorTglMulai) errorTglMulai.style.display = 'none';
        if (errorTglSelesai) errorTglSelesai.style.display = 'none';
        
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Jadwalkan Perjalanan Anda';
            submitBtn.classList.remove('btn-warning-state');
            submitBtn.style.background = ''; // Reset to default CSS
        }
    }

    if (tglMulaiInput && tglSelesaiInput) {
        tglMulaiInput.addEventListener('change', checkScheduleAvailability);
        tglSelesaiInput.addEventListener('change', checkScheduleAvailability);
    }
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        const submitBtn = bookingForm.querySelector('button[type="submit"]');

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const namaLengkap = document.getElementById('namaLengkap').value.trim();
            const tglMulai = document.getElementById('tglMulai').value;
            const tglSelesai = document.getElementById('tglSelesai').value;
            const adminTujuan = document.getElementById('adminTujuan').value;

            if (!namaLengkap || !tglMulai || !tglSelesai) {
                alert('Mohon lengkapi data Anda.');
                return;
            }

            const formatTanggal = (dateStr) => {
                const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const d = new Date(dateStr + 'T00:00:00');
                return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
            };

            const tglMulaiFormatted = formatTanggal(tglMulai);
            const tglSelesaiFormatted = formatTanggal(tglSelesai);

            if (isScheduleFull) {
                // ALTERNATIVE SCHEDULE MESSAGE (IF FULL)
                waMessage = `Halo Admin Anterin! 👋
Saya lihat jadwal Innova Zenix pada tanggal ${tglMulaiFormatted} s/d ${tglSelesaiFormatted} sudah penuh di web. 

Mohon info jika ada saran tanggal kosong lainnya untuk unit Zenix ini.
Nama saya: ${namaLengkap}

Terima kasih! 🙏`;
            } else if (currentTipeSewa === 'harian') {
                // DAILY DRAFT
                const paketSewa = document.getElementById('paketSewa').value;
                const jamMulai = document.getElementById('jamMulai').value || '08:00';
                const jamSelesai = document.getElementById('jamSelesai').value || '17:00';
                const lokasiJemput = document.getElementById('lokasi').value.trim();

                if (!lokasiJemput) {
                    alert('Mohon masukkan lokasi jemput.');
                    return;
                }

                waMessage = `Halo Admin Anterin! 👋
Saya ingin memesan layanan Sewa Innova Zenix Tipe G Bensin + Sopir (Harian).

Berikut detail pesanan saya:
👤 Nama: ${namaLengkap}
💎 Paket: ${paketSewa}
📅 Jadwal: ${tglMulaiFormatted} (${jamMulai}) s/d ${tglSelesaiFormatted} (${jamSelesai})
📍 Penjemputan: ${lokasiJemput}

Mohon info ketersediaan jadwal. Terima kasih! 🙏`;
            } else {
                // B2B MONTHLY DRAFT
                waMessage = `Halo Admin Anterin! 👋
Saya tertarik untuk menyewa Innova Zenix secara BULANAN.

Mohon info penawaran untuk:
👤 Nama/Instansi: ${namaLengkap}
📅 Rencana Mulai: ${tglMulaiFormatted}
📍 Area Pemakaian: (Semarang Kota / Luar Kota)
💼 Keperluan: (Operasional Kantor / Pribadi)

Mohon instruksi selanjutnya. Terima kasih! 🙏`;
            }

            const encodedMessage = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/${adminTujuan}?text=${encodedMessage}`;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

            window.open(waUrl, '_blank');

            // Analytics/Logging
            fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nama: namaLengkap,
                    tgl_mulai: tglMulai,
                    tgl_selesai: tglSelesai,
                    tipe_sewa: currentTipeSewa
                })
            }).catch(e => console.log('Silent backend fail:', e));

            setTimeout(() => {
                bookingForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Jadwalkan Perjalanan Anda';
                // Reset state to harian
                tipeSewaBtns[0].click();
            }, 1000);
        });
    }

});
