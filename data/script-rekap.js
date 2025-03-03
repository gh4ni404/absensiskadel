document.addEventListener("DOMContentLoaded", async function () {
  const kelas_wali = localStorage.getItem("kelasWali");
  const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';

  try {
    const response = await fetch(`${url}?action=getRekapByKelas&wali_kelas=${kelas_wali}`);
    const data_rekap = await response.json();
    console.log(data_rekap)

    renderCarousel(data_rekap);

  } catch (error) {
    console.error("Gagal Memuat Data Rekap by Kelas ", error);
  }
});



function renderCarousel(data) {
  const rekap = document.getElementById("rekap-container");
  rekap.innerHTML = "";
  const dataBulan = {};
  const statusMap = {
    "Hadir": "H",
    "Izin": "I",
    "Sakit": "S",
    "Alpa": "A"
  };

  Object.keys(data).forEach(tanggal => {
    const [tahun, bulan, hari] = tanggal.split("-")
    const bulanKey = `${tahun}-${bulan}`;
    const dateUnik = `${hari}`;

    if (!dataBulan[bulanKey]) {
      dataBulan[bulanKey] = {
        hariUnik: new Set(),
        siswa: {}
      };
    }

    dataBulan[bulanKey].hariUnik.add(dateUnik);

    

    data[tanggal].forEach(absensi => {
      const siswaKey = absensi.nama_siswa;
      if (!dataBulan[bulanKey].siswa[siswaKey]) {
        dataBulan[bulanKey].siswa[siswaKey] = {
          nama: absensi.nama_siswa,
          absensi: {},
          total: {
            H: 0,
            I: 0,
            S: 0,
            A: 0
          }
        };
      }
      const statusKey = statusMap[absensi.status];

      dataBulan[bulanKey].siswa[siswaKey].absensi[dateUnik] = statusKey;

      dataBulan[bulanKey].siswa[siswaKey].total[statusKey] += 1;
    });
  });

  Object.keys(dataBulan).forEach((bulan, index) => {
    let activeClass = index === 0 ? "active" : "";
    let dateArray = [...dataBulan[bulan].hariUnik].sort((a, b) => a - b);

    let headerHTML = `
      <tr>
        <th>Nama Siswa</th>
        ${dateArray.map(tgl => `<th class="text-center">${tgl}</th>`).join("")}
        <th class="text-center">Hadir</th>
        <th class="text-center">Sakit</th>
        <th class="text-center">Izin</th>
        <th class="text-center">Alpa</th>
      </tr>
    `;

    let siswaHTML = Object.values(dataBulan[bulan].siswa).map(siswa => `
      <tr>
        <td>${siswa.nama}</td>
        ${dateArray.map(tgl => {
          let statusAbsen = siswa.absensi[tgl];
          return  `<td class="text-center status-${statusAbsen}">${statusAbsen}</td>`;
        }).join("")}
        <td class="text-center">${siswa.total.H}</td>
        <td class="text-center">${siswa.total.S}</td>
        <td class="text-center">${siswa.total.I}</td>
        <td class="text-center">${siswa.total.A}</td>
      </tr>
    `).join("");

    let slideHTML = `
      <div class="carousel-item ${activeClass}">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">${new Intl.DateTimeFormat('id', { month: 'long', year: 'numeric' }).format(new Date(bulan))}</h5>
          </div>
          <div class="card-content">
            <div class="table-responsive">
              <table class="table mb-0">
                <thead>
                  ${headerHTML}
                </thead>
                <tbody>
                  ${siswaHTML}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    rekap.innerHTML += slideHTML;
    console.log(dataBulan);
  });
}

function renderStat(data) {

}
