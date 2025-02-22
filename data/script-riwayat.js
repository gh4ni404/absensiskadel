const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
let tableRiwayat;
const user = localStorage.getItem('userUser');
console.log(user);

async function loadRiwayat() {
  try {
    const response = await fetch(`${url}?action=getRiwayat&user_guru=${user}`);
    const {header, absen} = await response.json();

    if($.fn.DataTable.isDataTable('#riwayatTable')) {
      tableRiwayat.destroy();
    }

    const thead = document.querySelector('#riwayatTable thead');
    thead.innerHTML = `
    <tr>
      ${header.map(col => `<th>${col}</th>`).join('')}
    </tr>
    `;

    const tbody = document.querySelector('#riwayatTable tbody');
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
      </tr>
    `).join('');

    tableRiwayat = $('#riwayatTable').DataTable({
      paging: false,
      searching: false,
      ordering: true,
      info: true,
      order: [[0, 'desc']]
    });
  } catch (error) {
    console.error("Gagal Memuat data Riwayat: ", error);
  }
}

loadRiwayat();