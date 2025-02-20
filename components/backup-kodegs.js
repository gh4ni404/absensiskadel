const wbook = SpreadsheetApp.getActive();
const tb_user = wbook.getSheetByName("tb_user");
const tb_guru = wbook.getSheetByName("tb_guru");
const tb_gender = wbook.getSheetByName("tb_jk");
const tb_mapel = wbook.getSheetByName("tb_mapel");
const tb_kelas = wbook.getSheetByName("tb_kelas");
const tb_siswa = wbook.getSheetByName("tb_siswa");
const tb_absensi = wbook.getSheetByName("tb_absensi");
const tb_absen_siswa = wbook.getSheetByName("tb_absen_siswa");
const loggers = [];

function doGet(e) {
  const action = e.parameter.action;
  const user_guru = e.parameter.user_guru;
  const kelas = e.parameter.kelas;
  const mapel = e.parameter.mapel;

  if (action === 'getDashboardData') {
    return getDashboardData();
  }

  if (action === 'getGuru') {
    const guru = getGuruByUser(user_guru);
    return ContentService.createTextOutput(JSON.stringify(guru)).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getSiswaByKelas') {
    const siswa = getSiswaByKelas(kelas);
    return ContentService.createTextOutput(JSON.stringify(siswa)).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getAbsen') {
    const absen = getAllAbsen();
    return ContentService.createTextOutput(JSON.stringify(absen)).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getGender') {
    const gender = getAllGender();
    return ContentService.createTextOutput(JSON.stringify(gender)).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getMapel') {
    const mapel = getAllMapel();
    return ContentService.createTextOutput(JSON.stringify(mapel)).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getKelas') {
    const kelas = getAllClass();
    return ContentService.createTextOutput(JSON.stringify(kelas)).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'getSiswa') {
    const siswa = getAllStudents();
    return ContentService.createTextOutput(JSON.stringify(siswa)).setMimeType(ContentService.MimeType.JSON);
  }
  const users = getAllUsers();
  return ContentService.createTextOutput(JSON.stringify(users)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const logs = [];
  const params = JSON.parse(e.postData.contents);
  console.log("Data yang diterima: ", params);
  const { action, id, nama_guru, user_guru, password_guru, role, mapel, kelas, nama_siswa, jenis_kelamin, id_siswa, hari, tanggal, status, absensiData } = params;
  const username = params.username;
  const password = params.password;
  if (action === 'login') {
    const data = tb_user.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const sheetUsername = row[1]; // Kolom username
      const sheetPassword = row[2].toString(); // Kolom password
      if (sheetUsername === username && sheetPassword === password) {
        const nama_user = row[0]; // Kolom Nama user
        const role = row[3]; // Kolom role
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          role: role,
          nama: nama_user,
          user: sheetUsername
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Invalid username or password"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  let result;
  switch (action) {
    case 'addAbsen':
      const dataSiswa = tb_siswa.getDataRange().getValues();
      const dataAbsensi = tb_absensi.getDataRange().getValues();

      absensiData.forEach(data => {
        const siswa = dataSiswa.find(row => row[0] == data.id_siswa);
        if (siswa) {
          const nama_siswa = siswa[1];
          const kelas = siswa[3];
          const absensiExistIndex = dataAbsensi.slice(1).findIndex(row => {
            const formatedDate = Utilities.formatDate(new Date(row[6]), Session.getScriptTimeZone(), "yyyy-MM-dd");
            return row[0] == data.id_siswa && // id_siswa
              row[3] == data.mapel &&    // mapel
              row[4] == data.user_guru && // user_guru
              formatedDate == data.tanggal     // tanggal
          });
          if (absensiExistIndex !== -1) {
            // Jika data sudah ada, update status
            const rowIndex = absensiExistIndex + 1;
            tb_absensi.getRange(rowIndex + 1, 8).setValue(data.status); // Kolom status adalah kolom ke-8
            logs.push(`Absensi siswa ID ${data.id_siswa} pada ${data.tanggal} diperbarui menjadi ${data.status}`);
            result = { success: true, message: 'Absensi berhasil diupdate.', logs };
          } else {
            // Jika data belum ada, tambahkan data baru
            result = addAbsen(data.id_siswa, nama_siswa, kelas, data.mapel, data.user_guru, data.hari, data.tanggal, data.status);
          }
        } else {
          logs.push(`Siswa dengan ID ${data.id_siswa} tidak ditemukan.`);
        }
      });
      kirimWA();
      break;
    case 'add':
      if (params.hasOwnProperty('nama_guru')) {
        result = addUser(nama_guru, user_guru, password_guru, role, mapel, kelas);
      } else if (params.hasOwnProperty('nama_siswa')) {
        result = addSiswa(nama_siswa, jenis_kelamin, kelas);
      }
      break;
    case 'edit':
      if (params.hasOwnProperty('nama_guru')) {
        result = editUser(id, nama_guru, user_guru, password_guru, role, mapel, kelas);
      } else if (params.hasOwnProperty('nama_siswa')) {
        result = editSiswa(id, nama_siswa, jenis_kelamin, kelas);
      } else if (params.hasOwnProperty('id_siswa')) {
        result = editAbsen(id, id_siswa, mapel, user_guru, hari, tanggal, status);
      }
      break;
    case 'delete':
      if (params.hasOwnProperty('nama_guru')) {
        result = deleteUser(id);
      } else if (params.hasOwnProperty('nama_siswa')) {
        result = deleteSiswa(id);
      } else if (params.hasOwnProperty('id_siswa')) {
        result = deleteAbsen(id);
      }
      break;
    default:
      result = { success: false, message: 'Aksi tidak valid.' };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function kirimWA() {
  const sheet = tb_absen_siswa;
  const data = sheet.getDataRange().getValues(); // Ambil semua data
  const apiKey = "X6DCDH8qg1ubADx7tGPr"; // API Fonnte
  const url = "https://api.fonnte.com/send";

  for (let i = 1; i < data.length; i++) {
    let nama = data[i][0];
    let tanggal = data[i][1];
    let statusKehadiran = data[i][3];
    let noHpOrtu = data[i][4];
    let statusWA = data[i][5];

    if ((!statusWA || statusWA === "") && nama) { // Jika status WA masih kosong, kirim pesan
      const pesan = `Halo Bapak/Ibu, kami ingin menginformasikan bahwa anak Anda, *${nama}*, pada tanggal *${tanggal}* memiliki status kehadiran: *${statusKehadiran}*. Terima kasih.`;

      const options = {
        "method": "post",
        "headers": {
          "Authorization": apiKey
        },
        "payload": {
          "target": noHpOrtu,
          "message": pesan
        }
      };

      try {
        const response = UrlFetchApp.fetch(url, options);
        const result = JSON.parse(response.getContentText());

        if (result.status === true) {
          sheet.getRange(i + 1, 6).setValue("TERKIRIM");
        } else {
          sheet.getRange(i + 1, 6).setValue("GAGAL KIRIM");
        }
      } catch (error) {
        sheet.getRange(i + 1, 6).setValue("ERROR");
        Logger.log("Error mengirim WhatsApp: " + error.toString());
      }
    }
  }
}

function getDashboardData() {
  const jumlahSiswa = tb_siswa.getLastRow() - 1;
  const jumlahGuru = tb_guru.getLastRow() - 1;
  const bulanIni = new Date().getMonth() + 1;
  const tahunIni = new Date().getFullYear();

  const dataAbsen = tb_absensi.getDataRange().getValues();

  const rekapAbsen = {
    hadir: 0,
    sakit: 0,
    izin: 0,
    alpa: 0
  };

  const rekapTahunan = {
    hadir: Array(13).fill(0),
    sakit: Array(13).fill(0),
    izin: Array(13).fill(0),
    alpa: Array(13).fill(0)
  }

  for (let i = 1; i < dataAbsen.length; i++) {
    const tanggal = new Date(dataAbsen[i][6]);
    const bulan = tanggal.getMonth() + 1;
    const tahun = tanggal.getFullYear();
    const status = dataAbsen[i][7];

    if (bulan === bulanIni && tahun === tahunIni) {
      if (status === "Hadir") rekapAbsen.hadir++;
      else if (status === "Sakit") rekapAbsen.sakit++;
      else if (status === "Izin") rekapAbsen.izin++;
      else if (status === "Alpa") rekapAbsen.alpa++;
    }

    if (tahun === tahunIni) {
      if (status === "Hadir") rekapTahunan.hadir[bulan]++;
      else if (status === "Sakit") rekapTahunan.sakit[bulan]++;
      else if (status === "Izin") rekapTahunan.izin[bulan]++;
      else if (status === "Alpa") rekapTahunan.alpa[bulan]++;
    }
  }

  const totalKehadiran = rekapAbsen.hadir + rekapAbsen.sakit + rekapAbsen.izin + rekapAbsen.alpa;
  const rekapPersen = totalKehadiran > 0 ? Math.round((rekapAbsen.hadir / totalKehadiran) * 100) : 0;

  const response = {
    jumlah_siswa: jumlahSiswa,
    jumlah_guru: jumlahGuru,
    rekap_bulan_ini: rekapAbsen,
    rekap_tahunan: rekapTahunan,
    rekap_persen: rekapPersen,
    loggers
  }
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function getGuruByUser(user_guru) {
  const data_guru = tb_guru.getDataRange().getValues();
  const guru = data_guru.slice(1).find(row => row[1] === user_guru);
  if (guru) {
    return {
      nama_guru: guru[0],
      user_guru: guru[1],
      mapel: guru[4].split(',').map(item => item.trim()),
      kelas: guru[5].split(',').map(item => item.trim())
    };
  }
  return null;
}

function getSiswaByKelas(kelas) {
  const data_siswa = tb_siswa.getDataRange().getValues();
  const siswa = data_siswa.slice(1).filter(row => row[3] === kelas).map(row => ({
    id: row[0],
    nama_siswa: row[1],
    jenis_kelamin: row[2],
    kelas: row[3]
  }));
  return siswa;
}

function getAllAbsen() {
  const data_absen = tb_absensi.getDataRange().getValues();
  const header = data_absen[0];
  const absen = data_absen.slice(1).map((row, index) => ({
    id: index + 1,
    id_siswa: row[1],
    id_mapel: row[2],
    id_guru: row[3], //(guru1, guru2, ...)
    hari: row[4],
    tanggal: row[5],
    status: row[6]
  }));
  return { header, absen };
}

function getAllStudents() {
  const data_siswa = tb_siswa.getDataRange().getValues();
  const header = data_siswa[0];
  const siswa = data_siswa.slice(1).map((row, index) => ({
    id: index + 1,
    nama_siswa: row[1],
    jenis_kelamin: row[2],
    kelas: row[3]
  }));
  return { header, siswa };
}

function getAllMapel() {
  const data_mapel = tb_mapel.getDataRange().getValues();
  const mapel = data_mapel.slice(1).map(row => ({
    nama_mapel: row[0]
  }));
  return mapel;
}

function getAllGender() {
  const data_gender = tb_gender.getDataRange().getValues();
  const gender = data_gender.slice(1).map(row => ({
    jenis_kelamin: row[0]
  }));
  return gender;
}

function getAllClass() {
  const data_kelas = tb_kelas.getDataRange().getValues();
  const kelas = data_kelas.slice(1).map(row => ({
    nama_kelas: row[0]
  }));
  return kelas;
}

function getAllUsers() {
  const data_guru = tb_guru.getDataRange().getValues();
  const guru = data_guru.slice(1).map((row, index) => ({
    id: index + 1,
    nama_guru: row[0],
    user_guru: row[1],
    password_guru: row[2],
    role: row[3],
    mapel: row[4],
    kelas: row[5]
  }));
  return guru;
}

function addAbsen(id_siswa, nama_siswa, kelas, mapel, user_guru, hari, tanggal, status) {
  tb_absensi.appendRow([id_siswa, nama_siswa, kelas, mapel, user_guru, hari, tanggal, status]);
  return { success: true, message: 'Absensi berhasil ditambahkan!' };
}

function addSiswa(nama_siswa, jenis_kelamin, kelas) {
  tb_siswa.appendRow([nama_siswa, jenis_kelamin, kelas]);
  return { success: true, message: 'Siswa berhasil ditambahkan.' };
}

function addUser(nama_guru, user_guru, password_guru, role, mapel, kelas) {
  tb_guru.appendRow([nama_guru, user_guru, password_guru, role, mapel, kelas]);
  return { success: true, message: 'Pengguna berhasil ditambahkan.' };
}

function editAbsen(id, id_siswa, mapel, user_guru, hari, tanggal, status) {
  const data_absen = tb_absensi.getDataRange().getValues();
  const numericId = parseInt(id, 10);
  const rowIndex = numericId - 1;
  if (numericId < 0 || numericId >= data_absen.length) {
    return { success: false, message: 'ID Absensi tidak valid.' };
  }
  tb_absensi.getRange(numericId + 1, 2, 1, 6).setValues([[id_siswa, mapel, user_guru, hari, tanggal, status]]);
  return { success: true, message: 'Absensi berhasil diupdate.' }
}

function editSiswa(id, nama_siswa, jenis_kelamin, kelas) {
  const data_siswa = tb_siswa.getDataRange().getValues();
  const numericId = parseInt(id, 10);
  const rowIndex = numericId - 1;
  if (numericId < 0 || numericId >= data_siswa.length) {
    return { success: false, message: 'ID Siswa tidak valid. ' };
  }
  tb_siswa.getRange(numericId + 1, 2, 1, 3).setValues([[nama_siswa, jenis_kelamin, kelas]]);
  return { success: true, message: 'Data siswa berhasil di Update.' }
}

function editUser(id, nama_guru, user_guru, password_guru, role, mapel, kelas) {
  const data_guru = tb_guru.getDataRange().getValues();
  const numericId = parseInt(id, 10);
  const rowIndex = numericId - 1; // Kurangi 1 karena Google Sheets dimulai dari baris 1
  if (rowIndex < 0 || rowIndex >= data_guru.length) {
    return { success: false, message: 'ID pengguna tidak valid.' };
  }
  tb_guru.getRange(rowIndex + 1, 1, 1, 6).setValues([[nama_guru, user_guru, password_guru, role, mapel, kelas]]);
  return { success: true, message: 'Pengguna berhasil diupdate.' };
}

function deleteAbsen(id) {
  const data_absen = tb_absensi.getDataRange().getValues();
  if (id < 1 || id >= data_absen.length) {
    return { success: false, message: 'ID Absensi tidak valid.' };
  }
  tb_absensi.deleteRow(id + 1);
  return { success: true, message: 'Absensi berhasil dihapus.' };
}

function deleteSiswa(id) {
  const data_siswa = tb_siswa.getDataRange().getValues();
  if (id < 1 || id >= data_siswa.length) {
    return { success: false, message: 'ID Siswa tidak valid.' };
  }
  tb_siswa.deleteRow(id + 1);
  return { success: true, message: 'Data Siswa berhasil dihapus.' };
}

function deleteUser(id) {
  const data_guru = tb_guru.getDataRange().getValues();
  if (id < 1 || id > data_guru.length) {
    return { success: false, message: 'ID pengguna tidak valid.' };
  }
  tb_guru.deleteRow(id + 1);
  return { success: true, message: 'Pengguna berhasil dihapus. ' };
}