document.addEventListener('DOMContentLoaded', function () {
  const kelasWali = localStorage.getItem('kelasWali') || "Tidak diketahui";
  const userRole = localStorage.getItem('userRole');
  const menu_rekap = document.getElementById('menu-rekap');
  menu_rekap.innerHTML = "";

  if (menu_rekap) {
    if (userRole === 'wali_kelas') {
      setTimeout(() => {
        menu_rekap.innerHTML = `
        <a href="#" class="sidebar-link">
          <i class="fas fa-fw fa-calendar-alt"></i>
          <span id="menu-title">Rekap Absen Siswa - ${kelasWali}</span>
        </a>
        `;
      }, 0);
    }
  }
});
