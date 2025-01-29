async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    const data = await response.text();
    document.getElementById(id).innerHTML = data;

    // Muat ulang script yang dibutuhkan
    await reinitializeScripts([
      "/assets/static/js/components/dark.js",
      "/assets/extensions/perfect-scrollbar/perfect-scrollbar.min.js",
      "/assets/compiled/js/app.js"
    ]);

    // Pastikan semua fitur berjalan setelah sidebar dimuat
    if (id === "sidebar-container") {
      initializeDarkMode(); // Pastikan dark mode berfungsi
      initializeDropdowns(); // Pastikan semua dropdown berfungsi
    }
  } catch (error) {
    console.error(`Gagal memuat file ${file}: `, error);
  }
}

// Fungsi untuk mengaktifkan tombol dark mode setelah sidebar dimuat
function initializeDarkMode() {
  let darkToggle = document.getElementById("toggle-dark");

  if (darkToggle) {
    darkToggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    // Set dark mode berdasarkan localStorage
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      darkToggle.checked = true;
    }
  } else {
    console.warn("toggle-dark tidak ditemukan");
  }
}

// Fungsi untuk memastikan dropdown kedua juga berfungsi
function initializeDropdowns() {
  document.querySelectorAll(".sidebar-item.has-sub > a").forEach((dropdownToggle) => {
    dropdownToggle.addEventListener("click", function (event) {
      event.preventDefault(); // Hindari efek default dari link
      let parentItem = this.closest(".sidebar-item");
      parentItem.classList.toggle("active");

      // Tutup dropdown lain agar tidak semuanya terbuka
      document.querySelectorAll(".sidebar-item.has-sub").forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove("active");
        }
      });
    });
  });
}

// Fungsi untuk memuat ulang script yang diperlukan
async function reinitializeScripts(scriptUrls) {
  for (let i = 0; i < scriptUrls.length; i++) {
    const url = scriptUrls[i];
    let scriptId = `dynamicScript${i}`;

    // Hapus script lama jika ada
    let oldScript = document.getElementById(scriptId);
    if (oldScript) {
      oldScript.remove();
    }

    // Tambahkan script baru
    await new Promise((resolve) => {
      let script = document.createElement("script");
      script.src = url;
      script.id = scriptId;
      script.defer = true;
      script.onload = resolve; // Tunggu sampai script selesai dimuat
      document.body.appendChild(script);
    });
  }
}

// Muat sidebar setelah halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  loadComponent("sidebar-container", "/components/sidebar.html");
});
