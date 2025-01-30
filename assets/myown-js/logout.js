document.addEventListener('DOMContentLoaded', function () {
  document.body.style.display = 'none';
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');

  if (isLoggedIn !== 'true') {
    document.body.style.display = 'none';
    window.location.href = "/authen/error-403.html";
  } else if (userRole === 'admin' && window.location.pathname.includes('/pages/guru/index.html')) {
    document.body.style.display = 'none';
    window.location.href = "/authen/error-403.html";
  } else if (userRole === 'guru' && window.location.pathname.includes('/pages/admin/index.html')) {
    document.body.style.display = 'none';
    window.location.href = "/authen/error-403.html";
  } else {
    document.body.style.display = 'block';
    // document.body.style.display = 'block';
  }

});

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  alert('Anda telah logout')
  window.location.href = "/authen/login.html";
}