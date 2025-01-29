function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => document.querySelector(id).innerHTML = data)
    .catch(error => console.error(`Gagal memuat file ${file}: `, error));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#sidebarContainer", "/components/sidebar.html");
});
