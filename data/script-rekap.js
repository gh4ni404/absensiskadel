const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';
const user = localStorage.getItem('userUser');

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
    annotations: { position: "back" },
    series: [
      { name: "Hadir", data: data.rekap_tahunan.hadir.slice(1) },
      { name: "Sakit", data: data.rekap_tahunan.sakit.slice(1) },
      { name: "Izin", data: data.rekap_tahunan.izin.slice(1) },
      { name: "Alpa", data: data.rekap_tahunan.alpa.slice(1) },
    ],
    chart: { type: "bar", height: 250, toolbar: { show: false } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
    },
  };
  const chart = new ApexCharts(document.querySelector("#chart-profile-visit"), options);
  chart.render();
}

async function loadChartKelas(userGuru) {
  const response = await fetch(`${url}?action=getRekapByGuru&user_guru=${userGuru}`);
  const data = await response.json();
  if (!data) return;

  const container = document.getElementById('container-charts');

  Object.keys(data).forEach(kelas => {
    const kelasData = data[kelas];
    let totalData = 0;
    const chartDiv = document.createElement("div");
    chartDiv.className = "row";
    
    const categories = Object.keys(kelasData);
    const seriesData = {
      hadir: [],
      sakit: [],
      izin: [],
      alpa: [],
    };
    categories.forEach(mapel => {
      const rekapan = kelasData[mapel];
      seriesData.hadir.push(rekapan.Hadir);
      seriesData.sakit.push(rekapan.Sakit);
      seriesData.izin.push(rekapan.Izin);
      seriesData.alpa.push(rekapan.Alpa);
      totalData += (rekapan.Hadir || 0) + (rekapan.Sakit || 0) + (rekapan.Izin || 0) + (rekapan.Alpa || 0);
    });

    chartDiv.innerHTML = `
      <div class="col-10">
        <div class="d-flex align-items-center">
          <svg class="bi text-primary" width="32" height="32" fill="blue" style="width: 10px;">
            <use xlink:href="/assets/static/images/bootstrap-icons.svg#circle-fill"/>
          </svg>
          <h6 class="mb-0 ms-3">${kelas}</h6>
        </div>
      </div>
      <div class="col-2">
        <h6 class="mb-0 text-end">${totalData}</h6>
      </div>
      <div class="col-12">
        <div id="chart-${kelas}"></div>
      </div>
    `;
    container.appendChild(chartDiv);
    const options = {
      series: [
        { name: "Hadir", data: seriesData.hadir },
        { name: "Sakit", data: seriesData.sakit },
        { name: "Izin", data: seriesData.izin },
        { name: "Alpa", data: seriesData.alpa },
      ],
      chart: {
        height: 80,
        type: "area",
        toolbar: { show: false }
      },
      stroke: { width: 2 },
      grid: { show: false },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false },
      },
      show: false,
      yaxis: { labels: { show: false } },
      legend: { show: false }
    };
    const chart = new ApexCharts(chartDiv, options);
    chart.render();
  });
}

async function loadRiwayatCards() {
  try {
    const response = await fetch(`${url}?action=getRiwayat&user_guru=${user}`);
    const {absen} = await response.json();
    const sortedAbsen = absen.sort((a,b) => b.id - a.id);

    const latestAbsen = sortedAbsen.slice(0,3);
    const riwayatContainer = document.getElementById("riwayat_absensi");
    riwayatContainer.innerHTML = "";

    latestAbsen.forEach((absenItem) => {
      riwayatContainer.innerHTML += `
        <div class="recent-message d-flex px-4 py-3">
          <div class="avatar avatar-lg">
            ${absenItem.id}
          </div>
          <div class="name ms-4">
            <h6 class="mb-1">${absenItem.id_siswa} ${absenItem.id_kelas}</h6>
            <small class="text-muted mb-0">${absenItem.hari}, ${formateDate(absenItem.tanggal)} - ${absenItem.status}</small>
          </div>
        </div>
      `;
    });

    riwayatContainer.innerHTML += `
    <div class="px-4">
      <a href="/pages/guru/riwayat-absen.html" class="btn btn-block btn-xl btn-outline-primary font-bold mt-3 shadow">Klik untuk lainnya</a>
    </div>
    `;
  } catch (error) {
    console.error("Gagal Memuat Card Riwayat: ", error);
  }
}

function formateDate(dateRaw) {
  const date = new Date(dateRaw);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

fetchDashData();
loadChart();
loadChartKelas(user);
loadRiwayatCards();