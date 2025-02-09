const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
let tableSiswa;

async function loadStudent() {
  try {
    const response = await fetch(url + '?action=getSiswa');
    const { header, siswa } = await response.json();

    if ($.fn.DataTable.isDataTable('#siswaTable')) {
      tableSiswa.destroy();
    }

    const thead = document.querySelector('#siswaTable thead');
    thead.innerHTML = `
      <tr>
        ${header.map(col => `<th>${col}</th>`).join('')}
        <th>Aksi</th>
      </tr>
    `;
    const tbody = document.querySelector('#siswaTable tbody');
    tbody.innerHTML = siswa.map(siswa => `
      <tr>
        <td>${siswa.id}</td>
        <td>${siswa.nama_siswa}</td>
        <td>${siswa.jenis_kelamin}</td>
        <td>${siswa.kelas}</td>
        <td>
          <button class="btn btn-warning" onclick="enableEditMode(this.closest('tr'))"><i class="fas fa-fw fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteSiswa(${siswa.id})"><i class="fas fa-fw fa-trash"></i></button>
      </tr>
    `).join('');

    tableSiswa = $('#siswaTable').DataTable({
      paging: false,
      searching: true,
      ordering: true,
      info: true,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat memuat data: ", error);
  }
}

function enableEditMode(row) {
  const cells = row.cells;
  for (let i = 1; i < cells.length - 1; i++) {
    const cell = cells[i];
    const originalValue = cell.innerText;
    cell.innerHTML = `<input type="text" value="${originalValue}" class="form-control">`;
  }

  const actionCell = cells[cells.length - 1];
  actionCell.innerHTML = `
  <button onclick="saveEditMode(this)">Simpan</button>
  <button onclick="cancelEditMode(this)">Batal</button>
  `;
}

function saveEditMode(button) {
  const row = button.closest('tr');
  const id = row.cells[0].innerText;
  const nama_siswa = row.cells[1].querySelector('input').value;
  const jenis_kelamin = row.cells[2].querySelector('input').value;
  const kelas = row.cells[3].querySelector('input').value;

  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action: 'edit', id, nama_siswa, jenis_kelamin, kelas
    })
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      loadStudent();
    });
}

function cancelEditMode(button) {
  loadStudent();
}

loadStudent();