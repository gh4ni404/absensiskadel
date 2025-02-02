document.addEventListener('DOMContentLoaded', function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');

  if (isLoggedIn === 'true') {
    alert('Anda sudah login sebagai ' + userRole + '. Silahkan logout terlebih dahulu.');
    if (userRole === 'admin') {
      window.location.href = '/pages/admin/index.html';
    } 
    if (userRole === 'guru') {
      window.location.href = '/pages/guru/index.html'; // Redirect ke halaman guru
    }
  }
});

async function login(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const webAppUrl = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec'; // Ganti dengan URL Web App Anda

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      body: JSON.stringify({ action: 'login', username, password })
    });
    const result = await response.json();

    if (result.success) {
      alert('Login berhasil! Selamat Datang ' + result.role);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', result.role);
      localStorage.setItem('nameUser', result.nama);
      localStorage.setItem('userUser', result.user)

      if (result.role === 'admin') {
        window.location.href = '/pages/admin/index.html'; // Redirect ke halaman admin
      } else if (result.role === 'guru') {
        window.location.href = '/pages/guru/index.html'; // Redirect ke halaman guru
      }
    } else {
      alert(result.message || 'Username atau password salah.');
    }

    console.log(result); // Lihat respons di console browser
  } catch (error) {
    console.error('Error:', error);
  }
}