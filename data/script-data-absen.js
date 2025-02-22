const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
let tableAbsen;
const userRole = localStorage.getItem('userRole');

async function loadAbsen() {
  try {
    const response = await fetch(url + '?action=getAbsen');
    const { header, absen } = await response.json();

    if ($.fn.DataTable.isDataTable('#absenTable')) {
      tableAbsen.destroy();
    }

    const thead = document.querySelector('#absenTable thead');
    thead.innerHTML = `
      <tr>
        ${header.map(col => `<th>${col}</th>`).join('')}
        <th>Aksi</th>
      </tr>
    `;
    const tbody = document.querySelector('#absenTable tbody');
    tbody.innerHTML = absen.map(absen => `
      <tr>
        <td>${absen.id}</td>
        <td>${absen.id_siswa}</td>
        <td>${absen.id_kelas}</td>
        <td>${absen.id_mapel}</td>
        <td>${absen.id_guru}</td>
        <td>${absen.hari}</td>
        <td>${absen.tanggal}</td>
        <td>${absen.status}</td>
        <td>
          <button class="btn btn-warning" onclick="enableEditMode(this.closest('tr'))"><i class="fas fa-fw fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteSiswa(${absen.id})"><i class="fas fa-fw fa-trash"></i></button>
      </tr>
    `).join('');

    tableSiswa = $('#absenTable').DataTable({
      paging: false,
      searching: true,
      ordering: true,
      info: true,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat memuat data: ", error);
  }
}

async function enableEditMode(row) {
  try {
    const [resKelas, resMapel, resGuru] = await Promise.all([
      fetch(url + '?action=getKelas'),
      fetch(url + '?action=getMapel'),
      fetch(url + '?action=getGuruByName'),
    ]);
    const kelas = await resKelas.json();
    const mapel = await resMapel.json();
    const guru = await resGuru.json();
    console.log(kelas);
    console.log(mapel);
    console.log(guru);

    const cells = row.cells;
    const namaSiswaCell = cells[1];
    const namaSiswaValue = namaSiswaCell.innerText;
    namaSiswaCell.innerHTML = `<input type="text" value="${namaSiswaValue}" class="form-control">`;

    const kelasCell = cells[2];
    const kelasValue = kelasCell.innerText;
    kelasCell.innerHTML = `
  <select class="form-control">
    ${kelas.map(option => `
      <option value="${option.nama_kelas}" ${option.nama_kelas === kelasValue ? 'selected' : ''}>${option.nama_kelas}</option>
      `).join('')}
  </select>
  `;

    const mapelCell = cells[3];
    const mapelValue = mapelCell.innerText;
    mapelCell.innerHTML = `
  <select class="form-control">
    ${mapel.map(option => `
      <option value="${option.nama_mapel}" ${option.nama_mapel === mapelValue ? 'selected' : ''}>${option.nama_mapel}</option>
      `).join('')}
  </select>
  `;

    const guruCell = cells[4];
    const guruValue = guruCell.innerText;
    guruCell.innerHTML = `
  <select class="form-control">
    ${guru.map(option => `
      <option value="${option.user_guru}" ${option.user_guru === guruValue ? 'selected' : ''}>${option.user_guru}</option>
      `).join('')}
  </select>
  `;

    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `
  <button class="btn btn-info" onclick="saveEditMode(this)"><i class="fas fa-fw fa-check"></i></button>
  <button class="btn btn-danger" onclick="cancelEditMode(this)"><i class="fas fa-fw fa-times"></i></button>
  `;
  } catch (error) {
    console.error("terjadi kesalahan saat memuat data: ", error);
  }
}

function saveEditMode(button) {
  const row = button.closest('tr');
  const id = row.cells[0].innerText;
  const nama_siswa = row.cells[1].querySelector('input').value;
  const jenis_kelamin = row.cells[2].querySelector('select').value;
  const kelas = row.cells[3].querySelector('select').value;

  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action: 'edit', id, nama_siswa, jenis_kelamin, kelas
    })
  })
    .then(response => response.json())
    .then(result => {
      alert(result.message);
      loadAbsen();
    });
}

function cancelEditMode(button) {
  loadAbsen();
}

loadAbsen();