document.addEventListener('DOMContentLoaded', function () {
  const kelasWali = localStorage.getItem('kelasWali') || "Tidak diketahui";
  const userRole = localStorage.getItem('userRole');
  const menu_rekap = document.getElementById('menu-rekap');

  if (menu_rekap) {
    // if (userRole === 'guru') {
    //   menu_rekap.style.display = 'none';
    // } else 
    if (userRole === 'wali_kelas') {
      menu_rekap.style.display = 'block';
      document.getElementById('menu-title').innerText = `Rekap Absen Siswa - ${kelasWali}`;
    } 
  }
});
