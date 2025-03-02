document.addEventListener("DOMContentLoaded", async function(){
  const kelas_wali = localStorage.getItem("kelasWali");
  const url = 'https://script.google.com/macros/s/AKfycbwwr-VYZQKHK8oWFOGydcbegugGoYXQIaDgnxyAmgF_CMk2hbEM7S7Q-xofCPM-ryJ7/exec';

  try {
    const response = await fetch(`${url}?action=getRekapByKelas&wali_kelas=${kelas_wali}`);
    const data_rekap = await response.json();

    renderCarousel(data_rekap);

    console.log(data_rekap);
  } catch (error) {
    console.error("Gagal Memuat Data Rekap by Kelas ", error);
  }
});

function renderCarousel(data) {
  const rekap = document.getElementById("rekap-container");
  rekap.innerHTML="";

  const bulan = Object.keys(data);
  bulan.forEach((tanggal, index)=>{
    let activeClass = index === 0 ? "active" : "";
    let siswaHTML = data[tanggal].map(siswa => `
        <tr>
          <td>${siswa.nama_siswa}</td>
          <td>${siswa.mapel}</td>
          <td>${siswa.hari}</td>
          <td>${siswa.status}</td>
        </tr>
      `).join("");

    let slideHTML = `
      <div class="carousel-item ${activeClass}">
        <div class="card p-3">
          <h5>${tanggal}</h5>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Mata Pelajaran</th>
                <th>Hari</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${siswaHTML}
            </tbody>
          </table>
        </div>
      </div>
    `;

    rekap.innerHTML+=slideHTML;
  });
}

function renderStat(data) {

}