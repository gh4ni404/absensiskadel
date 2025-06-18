document.addEventListener('DOMContentLoaded', function () {
  const nama_guru = document.getElementById('namaGuru');
  const user_guru = document.getElementById('userGuru');
  const role_user = document.getElementById('roleUser');

  // const userRole = localStorage.getItem('userRole');
  const nameUser = localStorage.getItem('nameUser');
  const userUsers = localStorage.getItem('userUser');
  
  const kelasWali = localStorage.getItem('kelasWali') || "Tidak diketahui";
  const userRole = localStorage.getItem('userRole');

  if(nama_guru) nama_guru.textContent = nameUser;
  if(user_guru) user_guru.textContent = "Username : " + userUsers;
  if(role_user) role_user.textContent = "Level : " + userRole;

  const menu_rekap = document.getElementById('menu-rekap');
  menu_rekap.innerHTML = "";
  console.log(menu_rekap);
  console.log(userRole);
  console.log(kelasWali);

  if (menu_rekap) {
    if (userRole === 'guru') {
      setTimeout(() => {
        menu_rekap.innerHTML = `
        <a href="/pages/guru/rekap-absen.html" class="sidebar-link">
          <i class="fas fa-fw fa-calendar-alt"></i>
          <span id="menu-title">Rekap Absen Siswa - ${kelasWali}</span>
        </a>
        `;
      }, 1);
    }
  }
  // if (menu_rekap) {
  //   if (userRole === 'wali_kelas') {
  //     setTimeout(() => {
  //       menu_rekap.innerHTML = `
  //       <a href="/pages/guru/rekap-absen.html" class="sidebar-link">
  //         <i class="fas fa-fw fa-calendar-alt"></i>
  //         <span id="menu-title">Rekap Absen Siswa - ${kelasWali}</span>
  //       </a>
  //       `;
  //     }, 1);
  //   }
  // }
});
