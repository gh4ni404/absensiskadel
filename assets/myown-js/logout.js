document.addEventListener('DOMContentLoaded', function () {
  document.body.style.display = 'none';
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');

  if (isLoggedIn !== 'true') {
    window.location.href = "/authen/error-403.html";
  } else if (userRole === 'admin' && window.location.pathname.includes('/pages/guru/')) {
    window.location.href = "/authen/error-403.html";
  } else if (userRole === 'guru' && window.location.pathname.includes('/pages/admin/')) {
    window.location.href = "/authen/error-403.html";
  } else {
    document.body.style.display = 'block';
  }

});

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  alert('Anda telah logout')
  window.location.href = "/authen/login.html";
}