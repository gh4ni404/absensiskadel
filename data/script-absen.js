const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
const userRole = localStorage.getItem('userRole');
const user = localStorage.getItem('userUser');
let tableAbsen;

async function loadGuruData() {
  const response = await fetch(`${url}?action=getGuru&user_guru=${user}`);
  const guruData = await response.json();

  const mapelSelect = document.getElementById('mapel');
  mapelSelect.innerHTML = guruData.mapel.map(mapel => `
    <option value="${mapel}">${mapel}</option>
    `).join('');
  const kelasSelect = document.getElementById('kelas');
  kelasSelect.innerHTML = guruData.kelas.map(kelas => `
    <option value="${kelas}">${kelas}</option>
    `).join('');
  kelasSelect.addEventListener('change', () => {
    loadSiswaByKelas(kelasSelect.value);
  });

  loadSiswaByKelas(guruData.kelas[0]);
}

async function loadSiswaByKelas(kelas) {
  const response = await fetch(`${url}?action=getSiswaByKelas&kelas=${kelas}`);
  const siswaData = await response.json();
  const tbody = document.querySelector('#siswaList tbody');
  console.log(tbody)
  tbody.innerHTML = siswaData.map(siswa => `
    <tr>
      <td>${siswa.id}</td>
      <td>${siswa.nama_siswa}</td>
      <td>${siswa.jenis_kelamin}</td>
      <td>${siswa.kelas}</td>
      <td>
        <select id="status_${siswa.id}">
          <option value="Hadir">Hadir</option>
          <option value="Izin">Izin</option>
          <option value="Sakit">Sakit</option>
          <option value="Alpa">Alpa</option>
        </select>
      </td>
    </tr>
    `).join('');

  // tableAbsen = $('#siswaList').DataTable({
  //   paging: false,
  //   searching: true,
  //   ordering: true,
  //   infor: true
  // });

  console.log(siswaData);
  // const siswaList = document.getElementById('siswaList');
  // siswaList.innerHTML = siswaData.map(siswa => `
  // <div>
  //   <label>${siswa.nama_siswa}</label>
  //   <select id="status_${siswa.id}">
  //     <option value="Hadir">Hadir</option>
  //     <option value="Izin">Izin</option>
  //     <option value="Sakit">Sakit</option>
  //     <option value="Alpa">Alpa</option>
  //   </select>
  // </div>
  //   `).join('');


}

document.getElementById('absenForm').addEventListener('submit', async function (e) {
  e.preventDefault();
})

loadGuruData();