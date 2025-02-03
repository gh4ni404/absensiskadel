const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
$(document).ready(function () {
  let table;
  if (!table) {
    table = $('#guruTable').DataTable({
      ajax: {
        url: url,
        dataSrc: ''
      },
      columns: [
        { data: 'id' },
        { data: 'nama_guru' },
        { data: 'user_guru' },
        { data: 'password_guru' },
        { data: 'role' },
        { data: 'mapel' },
        { data: 'kelas' },
        {
          data: null,
          render: function (data) {
            return `
              <button class="btn btn-warning btn-sm" onclick="editGuru(${data.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteGuru(${data.id})">Hapus</button>
            `;
          }
        }
      ],
      liveajax: true,
    });
    $('#tambahGuruBtn').on('click', async function () {
      resetForm();
      await loadMapelDropdown();
      await loadKelasDropdown();
      $('#guruModal').modal('show');
    });
  }
});

async function loadMapelDropdown() {
  try {
    const response = await fetch(url + '?action=getMapel');
    const mapelData = await response.json();

    const mapelDropdown = document.getElementById('mapel');
    mapelDropdown.innerHTML = '<option value="">Pilih Mata Pelajaran</option>';

    mapelData.forEach((item) => {
      const optionMapel = document.createElement('option');
      optionMapel.value = item.nama_mapel;
      optionMapel.textContent = item.nama_mapel;
      mapelDropdown.appendChild(optionMapel);
    });
  } catch (error) {
    console.error("error memuat mata pelajaran: ", error);
  }
}

async function loadKelasDropdown() {
  try {
    const response = await fetch(url + '?action=getKelas');
    const kelasData = await response.json();

    const kelasDropdown = document.getElementById('kelas');
    kelasDropdown.innerHTML = '<option value="">Pilih Kelas</option>';

    kelasData.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.nama_kelas;
      option.textContent = item.nama_kelas;
      kelasDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("error memuat kelas: ",error);
  }
}

function resetForm() {
  document.getElementById('guruForm').reset();
  document.getElementById('submitBtn').textContent = 'Tambah Guru';
  document.getElementById('id').value = '';
}

document.getElementById('guruForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const nama_guru = document.getElementById('nama_guru').value;
  const user_guru = document.getElementById('user_guru').value;
  const password_guru = document.getElementById('password_guru').value;
  const role = document.getElementById('role').value;
  const mapel = document.getElementById('mapel').value;
  const kelas = document.getElementById('kelas').value;

  const action = id ? 'edit' : 'add';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action, id, nama_guru, user_guru, password_guru, role, mapel, kelas
    })
  });
  const result = await response.json();
  alert(result.message);
  resetForm();
  $('#guruTable').DataTable().ajax.reload();
  $('#guruModal').modal('hide');
});

async function editGuru(id) {
  const response = await fetch(url + `?action=edit&id=${id}`);
  const guru = await response.json();
  const g = guru.find(u => u.id === id);

  document.getElementById('id').value = g.id + 1;
  document.getElementById('nama_guru').value = g.nama_guru;
  document.getElementById('user_guru').value = g.user_guru;
  document.getElementById('password_guru').value = g.password_guru;
  document.getElementById('role').value = g.role;
  document.getElementById('mapel').value = g.mapel;
  document.getElementById('kelas').value = g.kelas;
  document.getElementById('submitBtn').textContent = 'Update Guru';

  // Pastikan dropdown terisi
  const mapelDropdown = document.getElementById('mapel');
  const kelasDropdown = document.getElementById('kelas');
  const optionsMapel = mapelDropdown.getElementsByTagName('option');
  const optionsKelas = kelasDropdown.getElementsByTagName('option');

  await loadMapelDropdown();
  await loadKelasDropdown();

  // Menentukan mata pelajaran yang sesuai dari data guru
  for (let option of optionsMapel) {
    if (option.value === g.mapel) {
      option.selected = true;  // Pilih mata pelajaran yang sesuai
      break;
    }
  }

  for(let option of optionsKelas) {
    if (option.value === g.kelas){
      option.selected = true;
      break;
    }
  }
  $('#guruModal').modal('show');
}

async function deleteGuru(id) {
  if (confirm('Apakah anda yakin ingin menghapus guru ini?')) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action: 'delete', id
      })
    });
    const result = await response.json();
    alert(result.message);
    $('#guruTable').DataTable().ajax.reload();
  }
}
