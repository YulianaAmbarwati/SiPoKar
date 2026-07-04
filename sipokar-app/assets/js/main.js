// assets/js/main.js
// Shared runtime functions for UI animations and responsive toggle handlers
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Navbar clock & tanggal berjalan (kosmetik, dipakai di seluruh dashboard)
    const clockEl = document.getElementById('navbarClock');
    const dateEl = document.getElementById('navbarDate');
    if (clockEl && dateEl) {
        const hariList = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        const renderClock = () => {
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
            dateEl.innerText = `${hariList[now.getDay()]}, ${now.getDate()} ${bulanList[now.getMonth()]} ${now.getFullYear()}`;
        };
        renderClock();
        setInterval(renderClock, 30000);
    }
});