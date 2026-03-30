document.addEventListener('DOMContentLoaded', () => {
    // 00. Premium Intro Screen Logic
    const introScreen = document.getElementById('intro-screen');
    const introSessionKey = 'anterin_intro_done_v1';

    if (introScreen) {
        if (!sessionStorage.getItem(introSessionKey)) {
            // First time in this session: Show intro
            introScreen.style.display = 'flex';
            
            // Lock scroll during intro
            document.body.style.overflow = 'hidden';

            // Start exit sequence after 3s (entrance animations are CSS-driven)
            setTimeout(() => {
                introScreen.classList.add('hide');
                
                // Allow scroll again
                document.body.style.overflow = '';

                // Fully remove from display after fade-out transition (1s)
                setTimeout(() => {
                    introScreen.style.display = 'none';
                }, 1000);

                // Mark session as done
                sessionStorage.setItem(introSessionKey, 'true');
            }, 3000);
        } else {
            // Already seen in this session: Skip intro
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
        greetingEl.textContent = `${greeting}.`;
        // Sub-tagline
        const greetingSub = document.getElementById('dynamicGreetingSub');
        if (greetingSub) greetingSub.textContent = 'Ke mana tujuan Anda hari ini?';
    }

    // 1. Onboarding Logic
    const onboardingOverlay = document.getElementById('onboardingOverlay');
    if (!localStorage.getItem('anterin_onboarded_v1')) {
        // Show onboarding if not visited yet
        onboardingOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const slides = document.querySelectorAll('.onboarding-slide');
        const dots = document.querySelectorAll('.dot');
        const btnNext = document.getElementById('btnNextOnboarding');
        let currentSlide = 0;

        btnNext.addEventListener('click', () => {
            if (currentSlide < slides.length - 1) {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
                currentSlide++;
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
                
                if (currentSlide === slides.length - 1) {
                    btnNext.textContent = 'Mulai Jelajahi';
                }
            } else {
                localStorage.setItem('anterin_onboarded_v1', 'true');
                onboardingOverlay.style.opacity = '0';
                setTimeout(() => {
                    onboardingOverlay.style.display = 'none';
                    document.body.style.overflow = '';
                }, 500);
            }
        });
    }

    // 1. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    const savedTheme = localStorage.getItem('anterin_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('anterin_theme', newTheme);
        
        if (newTheme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 2. Lightbox Gallery Logic (Premium Upgrade)
    const btnTanyaFoto = document.getElementById('btnTanyaFoto');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (btnTanyaFoto && lightboxOverlay) {
        const lightboxImgs = document.querySelectorAll('.lightbox-img');
        const lightboxIndicators = document.querySelectorAll('.indicator');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        let currentImgIndex = 0;

        function updateLightbox(index) {
            lightboxImgs.forEach((img, i) => {
                img.classList.toggle('active', i === index);
                if (lightboxIndicators[i]) {
                    lightboxIndicators[i].classList.toggle('active', i === index);
                }
            });
        }

        // Open Lightbox on Button Click
        btnTanyaFoto.addEventListener('click', (e) => {
            e.preventDefault();
            lightboxOverlay.classList.remove('hidden');
            // Small timeout to allow the browser to paint 'display' before 'opacity' transition
            setTimeout(() => {
                lightboxOverlay.classList.add('active');
            }, 10);
            updateLightbox(currentImgIndex);
        });

        // Close Logic
        lightboxClose.addEventListener('click', () => {
            lightboxOverlay.classList.remove('active');
            setTimeout(() => {
                lightboxOverlay.classList.add('hidden');
            }, 400); // 400ms matches CSS transition
        });

        // Click outside to close
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxClose.click();
            }
        });

        // Carousel Navigasi
        lightboxNext.addEventListener('click', () => {
            currentImgIndex = (currentImgIndex + 1) % lightboxImgs.length;
            updateLightbox(currentImgIndex);
        });

        lightboxPrev.addEventListener('click', () => {
            currentImgIndex = (currentImgIndex - 1 + lightboxImgs.length) % lightboxImgs.length;
            updateLightbox(currentImgIndex);
        });

        // Indicator Sync
        lightboxIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentImgIndex = index;
                updateLightbox(currentImgIndex);
            });
        });
    }

    // 3. Set min date for date inputs to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date();
    const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.setAttribute('min', todayStr);
    });

    // 3. Frontend Availability Calendar Logic
    let calYear, calMonth;
    let preloadedBlockedSet = new Set();
    
    // Track selected dates
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
            // Fallback Logic
            const mockBlockedDates = ['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-20'];
            return mockBlockedDates;
        }
        return [];
    }

    async function renderFrontCalendar() {
        const grid = document.getElementById('frontCalGrid');
        if (!grid) return; 
        
        const label = document.getElementById('frontCalMonthYear');
        const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

        label.textContent = `${months[calMonth]} ${calYear}`;
        grid.innerHTML = '';

        // Fetch blocked dates robustly
        const blockedArr = await fetchAvailabilityWithFallback(calYear, calMonth + 1);
        preloadedBlockedSet = new Set(blockedArr);

        const firstDay = new Date(calYear, calMonth, 1).getDay();
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

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

            if (dateObj < todayDate) {
                el.classList.add('past');
            } else {
                if (preloadedBlockedSet.has(dateStr)) {
                    el.classList.add('blocked');
                    el.style.pointerEvents = 'none'; // Ensure strictly unclickable
                } else {
                    el.classList.add('available');
                    
                    // Interaction logic
                    el.addEventListener('click', () => {
                        handleDateSelection(dateStr, dateObj);
                    });
                }
            }
            
            // Re-apply selection visuals after render
            updateDayVisuals(el, dateStr, dateObj);
            grid.appendChild(el);
        }
    }

    function handleDateSelection(dateStr, dateObj) {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Pick start date
            selectedStartDate = { str: dateStr, obj: dateObj };
            selectedEndDate = null;
        } else if (dateObj < selectedStartDate.obj) {
            // Picked an earlier date, reset start date
            selectedStartDate = { str: dateStr, obj: dateObj };
        } else {
            // Pick end date
            selectedEndDate = { str: dateStr, obj: dateObj };
        }

        // Sync with form inputs automatically
        const inputMulai = document.getElementById('tglMulai');
        const inputSelesai = document.getElementById('tglSelesai');
        
        if (inputMulai && selectedStartDate) {
            inputMulai.value = selectedStartDate.str;
        }
        if (inputSelesai) {
            inputSelesai.value = selectedEndDate ? selectedEndDate.str : '';
        }

        renderFrontCalendar(); // Re-render to update UI states
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
            
            // Check if in range
            if (dateObj > selectedStartDate.obj && dateObj < selectedEndDate.obj) {
                el.classList.add('in-range');
            }
        }
    }

    // Expose blocked set globally for validation
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
        // Export the function so the form submit can refresh it if needed
        window.renderAvailabilityCalendar = renderFrontCalendar;
    }

    // 4. Form Submission — POST to backend API, then redirect to WhatsApp
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const namaLengkap = document.getElementById('namaLengkap').value.trim();
            const tglMulai = document.getElementById('tglMulai').value;
            const tglSelesai = document.getElementById('tglSelesai').value;
            const jamMulai = document.getElementById('jamMulai').value || '08:00';
            const jamSelesai = document.getElementById('jamSelesai').value || '17:00';
            const lokasiJemput = document.getElementById('lokasi').value.trim();
            const adminTujuan = document.getElementById('adminTujuan').value;

            if (!namaLengkap || !tglMulai || !tglSelesai || !lokasiJemput || !adminTujuan) {
                alert('Mohon lengkapi semua data formulir sebelum memesan.');
                return;
            }

            if (new Date(tglMulai) > new Date(tglSelesai)) {
                alert('Tanggal Selesai tidak boleh lebih awal dari Tanggal Mulai.');
                return;
            }

            // Blocked Date Overlap Validation
            let start = new Date(tglMulai);
            let end = new Date(tglSelesai);
            let current = new Date(start);
            let hasOverlap = false;
            
            const blockedSet = window.getBookedDatesSet && window.getBookedDatesSet() || new Set();

            while (current <= end) {
                const checkStr = current.toISOString().split('T')[0];
                if (blockedSet.has(checkStr)) {
                    hasOverlap = true;
                    break;
                }
                current.setDate(current.getDate() + 1);
            }

            if (hasOverlap) {
                alert('Maaf, ada tanggal yang sudah Terisi di dalam rentang waktu yang Anda pilih. Silakan pilih tanggal lain.');
                return;
            }

            // Format tanggal ke format Indonesia yang enak dibaca
            const formatTanggal = (dateStr) => {
                const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
                const d = new Date(dateStr + 'T00:00:00');
                return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
            };

            const tglMulaiFormatted = formatTanggal(tglMulai);
            const tglSelesaiFormatted = formatTanggal(tglSelesai);

            // Construct WhatsApp Template dengan info Jam
            const waMessage = `Halo Admin Anterin! 👋
Saya ingin memesan layanan Sewa Innova Zenix Tipe G Bensin beserta Sopir (Pak Surono).

Berikut detail pesanan saya:
👤 Nama: ${namaLengkap}
📅 Tanggal: ${tglMulaiFormatted} (Jam ${jamMulai}) s/d ${tglSelesaiFormatted} (Jam ${jamSelesai})
📍 Lokasi Jemput: ${lokasiJemput}

Mohon info ketersediaan jadwal dan instruksi pembayaran DP. Terima kasih! 🙏`;

            const encodedMessage = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/${adminTujuan}?text=${encodedMessage}`;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

            try {
                // Background submission to DB
                await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nama: namaLengkap,
                        tgl_mulai: tglMulai,
                        tgl_selesai: tglSelesai,
                        lokasi_jemput: lokasiJemput
                    })
                });

                // Always use custom constructed URL
                window.open(waUrl, '_blank');
                
                // Reset form
                bookingForm.reset();
                if (typeof renderAvailabilityCalendar === 'function') {
                    renderAvailabilityCalendar();
                }
            } catch (err) {
                // Fallback: if backend is down, still redirect gracefully
                window.open(waUrl, '_blank');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Pesan via WhatsApp';
            }
        });
    }
});

// =========================================================
// GPS CURRENT LOCATION BUTTON
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const btnGPS = document.getElementById('btnGPS');
    const lokasiInput = document.getElementById('lokasi');

    if (btnGPS && lokasiInput) {
        btnGPS.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Browser Anda tidak mendukung fitur GPS.');
                return;
            }

            // State: loading
            btnGPS.classList.add('loading');
            btnGPS.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const latLng = { lat: latitude, lng: longitude };

                    // Gunakan SDK google.maps.Geocoder (sudah ter-load, tanpa fetch/CORS)
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: latLng, language: 'id' }, (results, status) => {
                        if (status === 'OK' && results && results.length > 0) {
                            // Ambil hasil terlengkap (biasanya index 0)
                            lokasiInput.value = results[0].formatted_address;
                        } else {
                            // Fallback: koordinat mentah jika geocoder gagal
                            lokasiInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                            console.warn('Geocoder gagal:', status);
                        }
                        lokasiInput.dispatchEvent(new Event('input', { bubbles: true }));
                        btnGPS.classList.remove('loading');
                        btnGPS.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
                    });
                },
                (error) => {
                    btnGPS.classList.remove('loading');
                    btnGPS.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
                    const msgs = {
                        1: 'Izin lokasi ditolak. Mohon izinkan akses lokasi di browser.',
                        2: 'Lokasi tidak dapat ditentukan. Coba lagi.',
                        3: 'Permintaan lokasi timeout. Coba lagi.'
                    };
                    alert(msgs[error.code] || 'Gagal mendapatkan lokasi.');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );

        });
    }
});

// =========================================================
// GOOGLE PLACES AUTOCOMPLETE ENGINE
// Callback dipanggil otomatis setelah Google Maps API selesai load
// =========================================================
function initGooglePlaces() {
    // Tunggu sampai DOM benar-benar siap dan input dapat berinteraksi
    const tryInit = () => {
        const lokasiInput = document.getElementById('lokasi');
        if (!lokasiInput) return; // elemen belum ada, skip

        // Pastikan google.maps.places tersedia
        if (typeof google === 'undefined' || !google.maps || !google.maps.places) return;

        const autocomplete = new google.maps.places.Autocomplete(lokasiInput, {
            componentRestrictions: { country: 'id' },
            fields: ['formatted_address', 'name'],
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(-7.1167, 110.2000),
                new google.maps.LatLng(-6.9000, 110.5000)
            ),
            strictBounds: false
        });

        // Jangan biarkan Google Maps intercept Enter key di form
        lokasiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.stopPropagation();
        });

        // Tangkap lokasi yang dipilih dari dropdown
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            let selectedAddress = '';

            if (place && place.formatted_address) {
                selectedAddress = place.formatted_address;
            } else if (place && place.name) {
                selectedAddress = place.name;
            }

            if (selectedAddress) {
                lokasiInput.value = selectedAddress;
                lokasiInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    };

    // Delay kecil untuk pastikan DOM + Google SDK fully mounted
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(tryInit, 100));
    } else {
        setTimeout(tryInit, 100);
    }
}
