const nama_guru = document.getElementById('namaGuru');
const user_guru = document.getElementById('userGuru');
const role_user = document.getElementById('roleUser');

const isLoggedIn = localStorage.getItem('isLoggedIn');
const userRole = localStorage.getItem('userRole');
const nameUser = localStorage.getItem('nameUser');
const userUsers = localStorage.getItem('userUser');

nama_guru.textContent = nameUser;
user_guru.textContent = "Username : "+userUsers;
role_user.textContent = "Level : "+userRole;

const kelasWali = localStorage.getItem('kelasWali') || "Tidak diketahui";
const menu_rekap = document.getElementById('menu-rekap');

if(userRole === 'guru') {
  menu_rekap.style.display = 'none';
} else if (userRole === 'wali_kelas') {
  document.getElementById('menu-title').innerText = `Rekap Absen Siswa - ${kelasWali}`;
  menu_rekap.style.display = 'block';
}