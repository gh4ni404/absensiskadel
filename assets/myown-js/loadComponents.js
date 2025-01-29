function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => document.getElementById(id).innerHTML = data)
    .catch(error => console.error(`Gagal memuat file ${file}: `, error));
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("sidebar-container", "components/sidebar.html");
});