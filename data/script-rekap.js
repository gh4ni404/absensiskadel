const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';

async function fetchDashData() {
  try {
    let response = await fetch(`${url}?action=getDashboardData`);
    let data = await response.json();
    document.getElementById("jumlah_siswa").innerText = data.jumlah_siswa;
    document.getElementById("jumlah_guru").innerText = data.jumlah_guru;
    document.getElementById("rekapHadir").innerText = `Hadir: ${data.rekap_bulan_ini.hadir}`;
    document.getElementById("rekapIzin").innerText = `Izin: ${data.rekap_bulan_ini.izin}`;
    document.getElementById("rekapSakit").innerText = `Sakit: ${data.rekap_bulan_ini.sakit}`;
    document.getElementById("rekapAlpa").innerText = `Alpa: ${data.rekap_bulan_ini.alpa}`;
    document.getElementById("rekapPersen").innerText = `${data.rekap_persen}%`;
  } catch (error) {
    console.error("Terjadi kesalahan saat melakukan fetch:", error)
  }
}

async function loadChart() {
  let response = await fetch(`${url}?action=getDashboardData`);
  let data = await response.json();
  const options = {
    series: [
      { name: "Sakit", data: data.rekap_tahunan.sakit },
      { name: "Hadir", data: data.rekap_tahunan.hadir },
      { name: "Izin", data: data.rekap_tahunan.izin },
      { name: "Alpa", data: data.rekap_tahunan.alpa },
    ],
    chart: { type: "area", height: 350, toolbar: { show: false } },
    grid: { show: false },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["-", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    show: false,
    yaxis: { labels: { show: false } }
  };
  const chart = new ApexCharts(document.querySelector("#chart-profile-visit"), options);
  chart.render();
}

fetchDashData();
loadChart();