const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';

async function fetchDashData() {
  try {
    let response = await fetch(`${url}?action=getDashboardData`);
    let data = await response.json();
    console.log(data);
    document.getElementById("jumlah_siswa").innerText = data.jumlah_siswa;
    document.getElementById("jumlah_guru").innerText = data.jumlah_guru;

  } catch (error) {
    console.error("Terjadi kesalahan saat melakukan fetch:", error)
  }
}

fetchDashData();