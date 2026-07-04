// assets/js/db.js

// Dynamic character classification status criteria
function calculateCharacterStatus(points) {
    if (points >= 140) return 'Teladan';
    if (points >= 100) return 'Sangat Baik';
    if (points >= 75) return 'Baik';
    if (points >= 50) return 'Perlu Perhatian';
    return 'Perlu Pembinaan';
}

// Menghitung progres poin siswa menuju status berikutnya (untuk widget progress bar)
function getNextStatusInfo(points) {
    const tiers = [
        { status: 'Perlu Pembinaan', min: 0 },
        { status: 'Perlu Perhatian', min: 50 },
        { status: 'Baik', min: 75 },
        { status: 'Sangat Baik', min: 100 },
        { status: 'Teladan', min: 140 }
    ];
    for (let i = 0; i < tiers.length; i++) {
        if (points < tiers[i].min) {
            const prevMin = tiers[i - 1] ? tiers[i - 1].min : 0;
            const range = tiers[i].min - prevMin;
            const progressed = points - prevMin;
            return {
                nextStatus: tiers[i].status,
                pointsNeeded: tiers[i].min - points,
                percent: Math.max(0, Math.min(100, Math.round((progressed / range) * 100)))
            };
        }
    }
    return { nextStatus: null, pointsNeeded: 0, percent: 100 }; // Sudah di puncak (Teladan)
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'Teladan': return 'bg-success text-white';
        case 'Sangat Baik': return 'bg-info text-dark';
        case 'Baik': return 'bg-primary text-white';
        case 'Perlu Perhatian': return 'bg-warning text-dark';
        case 'Perlu Pembinaan': return 'bg-danger text-white';
        default: return 'bg-secondary text-white';
    }
}

function getTimeGreeting() {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 11) return 'Selamat Pagi';
    if (hours >= 11 && hours < 15) return 'Selamat Siang';
    if (hours >= 15 && hours < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

// Global Core System Initialization
function initLocalStorageData() {
    if (!localStorage.getItem('sipokar_initialized')) {
        
        // System Identity Control Access
        const users = [
            { username: 'admin', password: 'admin123', name: 'Zulva Alfarizi', role: 'admin', initial: 'ZA' },
            { username: 'gurubk', password: 'bk123', name: 'Dra. Endang Lestari', role: 'gurubk', initial: 'EL' },
            { nisn: '0098765431', password: 'siswa123', name: 'Aditya Pratama', role: 'siswa', initial: 'AP' },
            { nisn: '0098765432', password: 'siswa123', name: 'Berlian Aura', role: 'siswa', initial: 'BA' },
            { nisn: '0098765433', password: 'siswa123', name: 'Citra Kirana', role: 'siswa', initial: 'CK' },
            { username: 'ortu_aditya', password: 'ortu123', name: 'Bambang Pratama', role: 'orangtua', initial: 'BP', targetNisn: '0098765431' }
        ];

        // Academic Classes Entity
        const classes = ['VII-A', 'VIII-A', 'IX-A', 'IX-B'];

        // Core Business Rules Engine Configurations
        const rules = [
            { id: 'P001', type: 'prestasi', name: 'Juara 1 Lomba Sains Nasional', points: 50 },
            { id: 'P002', type: 'prestasi', name: 'Pengurus Aktif OSIS Inti', points: 30 },
            { id: 'P003', type: 'prestasi', name: 'Membantu Aksi Sosial Sekolah', points: 15 },
            { id: 'L001', type: 'pelanggaran', name: 'Terlambat Masuk Sekolah (>15 Menit)', points: 10 },
            { id: 'L002', type: 'pelanggaran', name: 'Membolos Jam Pelajaran Efektif', points: 25 },
            { id: 'L003', type: 'pelanggaran', name: 'Atribut Seragam Tidak Lengkap', points: 5 },
            { id: 'L004', type: 'pelanggaran', name: 'Merusak Fasilitas Sarana Prasarana', points: 40 }
        ];

        // Core Academic Student Repository (Default baseline index: 100 Poin)
        const students = [
            { nisn: '0098765431', name: 'Aditya Pratama', class: 'IX-A', points: 145, status: 'Teladan' },
            { nisn: '0098765432', name: 'Berlian Aura', class: 'IX-A', points: 105, status: 'Sangat Baik' },
            { nisn: '0098765433', name: 'Citra Kirana', class: 'VIII-A', points: 70, status: 'Perlu Perhatian' },
            { nisn: '0098765434', name: 'Dewa Nyoman', class: 'VII-A', points: 45, status: 'Perlu Pembinaan' }
        ];

        // Transactional History Record Entries
        const records = [
            { id: 'REC-1001', nisn: '0098765431', type: 'prestasi', ruleId: 'P001', ruleName: 'Juara 1 Lomba Sains Nasional', points: 50, date: '2026-06-10', note: 'Medali Emas Tingkat Nasional', inputBy: 'Dra. Endang Lestari' },
            { id: 'REC-1002', nisn: '0098765431', type: 'pelanggaran', ruleId: 'L003', ruleName: 'Atribut Seragam Tidak Lengkap', points: 5, date: '2026-06-12', note: 'Tidak menggunakan dasi resmi upacara', inputBy: 'Dra. Endang Lestari' },
            { id: 'REC-1003', nisn: '0098765433', type: 'pelanggaran', ruleId: 'L002', ruleName: 'Membolos Jam Pelajaran Efektif', points: 25, date: '2026-06-14', note: 'Lompat pagar kantin jam ke-5', inputBy: 'Dra. Endang Lestari' },
            { id: 'REC-1004', nisn: '0098765434', type: 'pelanggaran', ruleId: 'L004', ruleName: 'Merusak Fasilitas Sarana Prasarana', points: 40, date: '2026-06-18', note: 'Mencoret meja lab menggunakan pilox', inputBy: 'Zulva Alfarizi' }
        ];

        localStorage.setItem('sipokar_users', JSON.stringify(users));
        localStorage.setItem('sipokar_classes', JSON.stringify(classes));
        localStorage.setItem('sipokar_rules', JSON.stringify(rules));
        localStorage.setItem('sipokar_students', JSON.stringify(students));
        localStorage.setItem('sipokar_records', JSON.stringify(records));
        localStorage.setItem('sipokar_initialized', 'true');
    }
}

// Global Custom Application Toast Alert Component Injector
function showToastNotification(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    const toastNode = document.createElement('div');
    toastNode.className = `toast show align-items-center text-white ${bgClass} border-0 mb-2 fade-in-up`;
    toastNode.setAttribute('role', 'alert');
    toastNode.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-medium">
                <i class="fa-solid ${iconClass} me-2"></i> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    container.appendChild(toastNode);
    setTimeout(() => { toastNode.remove(); }, 4000);
}

function handleSessionLogout() {
    localStorage.removeItem('sipokar_session');
    window.location.href = 'login.html';
}

initLocalStorageData();