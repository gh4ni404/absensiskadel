const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
let tableSiswa;

async function loadStudent() {
  try {
    const response = await fetch(url + '?action=getSiswa');
    const siswa = await response.json();

    if($.fn.DataTable.isDataTable('#siswaTable')){
      tableSiswa.destroy();
    }

    const tbody = document.querySelector('#siswaTable tbody');
    tbody.innerHTML = siswa.map(siswa => `
      <tr>
        <td>${siswa.id}</td>
        <td>${siswa.nama_siswa}</td>
      </tr>
    `).join('');

    console.log(siswa);
  } catch (error) {

  }


}

loadStudent();