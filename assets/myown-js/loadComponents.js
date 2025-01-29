function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      reinitializeMazer();
    })
    .catch(error => console.error(`Gagal memuat file ${file}: `, error));
}

function reinitializeMazer() {
  // Cek apakah app.js sudah dimuat sebelumnya
  let oldScript = document.getElementById("mazerScript");
  if (oldScript) {
      oldScript.remove(); // Hapus script lama agar tidak duplikasi
  }

  // Muat ulang script app.js
  let script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/zuramai/mazer@docs/demo/assets/compiled/js/app.js";
  script.id = "mazerScript";
  script.defer = true;
  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("sidebar-container", "/components/sidebar.html");
  loadComponent("footer", "/components/footer.html")
});