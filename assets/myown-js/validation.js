
const authForm = document.getElementById("authForm");
const submitBtn = authForm.querySelector("button[type='submit']");

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

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

  submitBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm"></span> Login...
  `;
  submitBtn.disabled = true;

  if (username === '' || password === '') {
    Swal.fire({
      icon: "warning",
      title: "Oops",
      text: "Username dan Password tidak boleh kosong!"
    });
    submitBtn.innerHTML = "Log in";
    submitBtn.disabled = false;
    return;
  }

  const webAppUrl = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec'; // Ganti dengan URL Web App Anda

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      body: JSON.stringify({ action: 'login', username, password })
    });
    const result = await response.json();

    if (result.success) {
      // alert('Login berhasil! Selamat Datang ' + result.role);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', result.role);
      localStorage.setItem('nameUser', result.nama);
      localStorage.setItem('userUser', result.user);
      if (result.role === 'wali_kelas') {
        localStorage.setItem('kodeWali', result.kodeWali);
        localStorage.setItem('kelasWali', result.kelas);
      }

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat datang, ${result.nama}`,
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        if (result.role === 'admin') {
          window.location.href = '/pages/admin/index.html'; // Redirect ke halaman admin
        } else if (result.role === 'guru') {
          window.location.href = '/pages/guru/index.html'; // Redirect ke halaman guru
        }
      });


    } else {
      // alert(result.message || 'Username atau password salah.');
      Toast.fire({
        icon: "error",
        title: "Username atau password anda salah. Silahkan coba lagi!"
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    submitBtn.innerHTML = "Login";
    submitBtn.disabled = false;
  }
}

(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();