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
  const siswaList = document.getElementById('siswaList');
  siswaList.innerHTML = siswaData.map(siswa => `
        <div class="input-group mb-3">
          <label class="input-group-text" for="status_${siswa.id}">${siswa.nama_siswa}</label>
          <select class="form-select" id="status_${siswa.id}">
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Alpa">Alpa</option>
          </select>
        </div>
      `).join('');
}

document.getElementById('absenForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const mapel = document.getElementById('mapel').value;
  const kelas = document.getElementById('kelas').value;
  const tanggal = document.getElementById('tanggal').value;
  const user_guru = user; // Ambil username guru sebagai ID guru

  // Ambil status kehadiran untuk setiap siswa
  const siswaData = await fetch(`${url}?action=getSiswaByKelas&kelas=${kelas}`);
  const siswaList = await siswaData.json();
  const absensiData = siswaList.map(siswa => ({
    id_siswa: siswa.id,
    mapel: mapel,
    user_guru,
    hari: new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' }),
    tanggal,
    status: document.getElementById(`status_${siswa.id}`).value
  }));
  console.log('data yang dikirim: ', absensiData);

  // Kirim data absensi ke backend
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action: 'addAbsen',
      absensiData
    })
  });
  const result = await response.json();
  console.log('Hasilnya : ', result);
  alert(result.message);
});

loadGuruData();