// --- app.js ---

// Fungsi Navigasi Halaman
function showPage(pageId) {
    document.querySelectorAll('.app-page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    document.getElementById(pageId + '-page').classList.remove('hidden');
    document.getElementById(pageId + '-page').classList.add('active');
}

// Panggil untuk memulai di halaman profil
document.addEventListener('DOMContentLoaded', () => {
    showPage('profile');
    startTracking(); // Mulai pelacakan waktu segera
    checkAttendanceStatus(); // Cek status absensi
});


// ===================================
// 1. Fitur Waktu Penggunaan (Pelacakan Sesi)
// ===================================
let startTime; // Waktu mulai sesi

function startTracking() {
    // Gunakan sessionStorage agar waktu terhitung selama sesi browser aktif
    if (sessionStorage.getItem('sessionStartTime')) {
        startTime = parseInt(sessionStorage.getItem('sessionStartTime'));
    } else {
        startTime = new Date().getTime();
        sessionStorage.setItem('sessionStartTime', startTime);
    }
    setInterval(updateTime, 1000);
}

function updateTime() {
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    const H = Math.floor(elapsedSeconds / 3600);
    const M = Math.floor((elapsedSeconds % 3600) / 60);
    const S = elapsedSeconds % 60;

    const timeString = 
        String(H).padStart(2, '0') + ' jam ' +
        String(M).padStart(2, '0') + ' menit ' +
        String(S).padStart(2, '0') + ' detik';

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
}

// ===================================
// 2. Fitur Absensi Penggunaan Harian
// ===================================
function getTodayDate() {
    return new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
}

function checkAttendanceStatus() {
    const today = getTodayDate();
    const lastCheckIn = localStorage.getItem('lastCheckInDate');
    const statusElement = document.getElementById('attendance-status');
    const checkInBtn = document.getElementById('check-in-btn');

    if (lastCheckIn === today) {
        statusElement.textContent = 'Sudah Absen Hari Ini! 🎉';
        statusElement.style.color = 'green';
        checkInBtn.disabled = true;
    } else {
        statusElement.textContent = 'Belum Absen Hari Ini.';
        statusElement.style.color = 'red';
        checkInBtn.disabled = false;
    }
}

document.getElementById('check-in-btn').addEventListener('click', () => {
    const today = getTodayDate();
    localStorage.setItem('lastCheckInDate', today);
    alert('Absensi berhasil dicatat untuk tanggal ' + today);
    checkAttendanceStatus();
});


// ===================================
// 3. Fitur Notifikasi Pengingat (Contoh)
// ===================================

// Fungsi ini perlu dipanggil saat tugas baru ditambahkan
function scheduleNotification(taskName, deadline) {
    // **Peringatan:** Notifikasi Browser hanya berfungsi jika diizinkan pengguna.
    if (!("Notification" in window)) {
        console.warn("Browser ini tidak mendukung notifikasi.");
        return;
    }

    if (Notification.permission === "granted") {
        const timeUntil = new Date(deadline).getTime() - new Date().getTime();
        
        // Contoh: Atur timer untuk notifikasi (misal 1 menit sebelum deadline)
        setTimeout(() => {
            new Notification("🚨 PENGINGAT TUGAS", {
                body: `Tugas "${taskName}" akan jatuh tempo sekarang!`,
                icon: './icon.png' // Ganti dengan path ikon aplikasi Anda
            });
        }, timeUntil); 

    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                scheduleNotification(taskName, deadline); // Coba lagi
            }
        });
    }
}

// Contoh Panggilan (perlu diintegrasikan ke form submit)
// scheduleNotification("Presentasi RPL", "2025-11-21T11:00:00");
