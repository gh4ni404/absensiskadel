document.addEventListener('DOMContentLoaded', function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');

  if (isLoggedIn !== 'true') {
    window.location.href = "/authen/error-403.html";
    alert('Anda belum login. Silahkan login terlebih dahulu.')
  }
  if (userRole !== 'admin') {
    window.location.href = "/authen/error-403.html";
    alert('Anda tidak memiliki akses ke halaman admin. Silahkan login sebagai admin!');
  }
  if (window.location.pathname.includes('/pages/guru/index.html') && userRole !== 'guru') {
    window.location.href = "/authen/error-403.html";
    alert('Anda tidak memiliki akses ke halaman guru. Silahkan login sebagai guru!');
  }
});

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  alert('Anda telah logout')
  window.location.href = "/authen/login.html";
}