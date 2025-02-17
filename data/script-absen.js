const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
const userRole = localStorage.getItem('userRole');
const user = localStorage.getItem('userUser');
const absenForm = document.getElementById("absenForm");
const submitBtn = absenForm.querySelector("button[type='submit']");
const inputs = absenForm.querySelectorAll("input, select");
let emptyField = null;
for (let input of inputs) {
  if (input.value.trim() === "") {
    emptyField = input;
    break;
  }
}
const Swal2 = Swal.mixin({
  customClass: {
    input: 'form-control'
  }
});
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});
let siswaListData = []; // Menyimpan daftar siswa agar tidak perlu fetch ulang saat submit

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

  loadSiswaByKelas(guruData.kelas[0]); // Load siswa pertama kali berdasarkan kelas pertama
}

async function loadSiswaByKelas(kelas) {
  const response = await fetch(`${url}?action=getSiswaByKelas&kelas=${kelas}`);
  siswaListData = await response.json(); // Simpan data siswa
  const siswaTable = document.getElementById('siswaTableBody');
  siswaTable.innerHTML = siswaListData.map((siswa, index) => `
    <tr>
      <td class="text-center">${index + 1}</td>
      <td class="w-md-50">${siswa.nama_siswa}</td>
      <td class="text-md-center">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="status_${siswa.id}" id="hadir_${siswa.id}" value="Hadir">
          <label class="form-check-label" for="hadir_${siswa.id}">Hadir</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="status_${siswa.id}" id="izin_${siswa.id}" value="Izin">
          <label class="form-check-label" for="izin_${siswa.id}">Izin</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="status_${siswa.id}" id="sakit_${siswa.id}" value="Sakit">
          <label class="form-check-label" for="sakit_${siswa.id}">Sakit</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="status_${siswa.id}" id="alpa_${siswa.id}" value="Alpa" checked>
          <label class="form-check-label" for="alpa_${siswa.id}">Alpa</label>
        </div>
      </td>
      <!-- <td>
        <input type="text" class="form-control" id="keterangan_${siswa.id}" placeholder="Keterangan (opsional)">
      </td> -->
    </tr>
  `).join('');
}

absenForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const mapel = document.getElementById('mapel').value;
  // const kelas = document.getElementById('kelas').value;
  const tanggal = document.getElementById('tanggal').value;
  const user_guru = user;

  if (!tanggal) {
    setTimeout(()=> {
      Toast.fire({
      icon: 'error',
      title: 'Masukkan Tanggal terlebih dahulu'
    });
  }, 900);
    
    return;
  }

  submitBtn.innerHTML = `
  <span class="spinner-border spinner-border-sm"></span> Menyimpan...
  `;
  submitBtn.disabled = true;

  const absensiData = siswaListData.map(siswa => ({
    id_siswa: siswa.id,
    mapel,
    user_guru,
    hari: new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' }),
    tanggal,
    status: document.querySelector(`input[name="status_${siswa.id}"]:checked`).value,
    // keterangan: document.getElementById(`keterangan_${siswa.id}`).value || "" // Ambil keterangan jika ada
  }));

  console.log('Data yang dikirim:', absensiData);

  // Kirim data absensi ke backend
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'addAbsen',
        absensiData
      })
    });
    if (response.ok) {
      const result = await response.json();
      console.log('Hasilnya:', result);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: result.message
      });
    } else {
      throw new Error("Gagal Menyimpan Absensi. Coba lagi.");
    }
  } catch (error) {
    alert(error.message);
  } finally {
    submitBtn.innerHTML = "Simpan";
    submitBtn.disabled = false;
  }
});

loadGuruData();
