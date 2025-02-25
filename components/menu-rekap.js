const kelasWali = localStorage.getItem('kelasWali') || "Tidak diketahui";
const userRole = localStorage.getItem('userRole');
const menu_rekap = document.getElementById('menu-rekap');

if(userRole === 'guru') {
  menu_rekap.style.display = 'none';
} else if (userRole === 'wali_kelas') {
  document.getElementById('menu-title').innerText = `Rekap Absen Siswa - ${kelasWali}`;
  menu_rekap.style.display = 'block';
}