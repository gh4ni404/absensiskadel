const baseUrl = "https://script.google.com/macros/s/AKfycbwxxDPptmg0b4BlIJJ-pie4POoeMIJjQGFEsHj7oAHHTU3YEEK9c2CCQb1n2D4UxB5YOg/exec";
const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
const loadingData = document.getElementById("loading");

let table;
function clsCache() {
  const lastClear = localStorage.getItem("lastCacheClear");
  const now = new Date();
  if (!lastClear || (now - new Date(lastClear)) > 7 * 24 * 60 * 60 * 1000) {
    localStorage.clear();
    localStorage.setItem("lastCacheClear", now.toISOString());
  }
}
clsCache();

function fetchData(day) {
  let url = day ? `${baseUrl}?day=${day}` : baseUrl;
  document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
  const activeTab = document.querySelector(`a[onclick="fetchData('${day}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  const tableWrapper = document.querySelector('.table-wrapper');
  tableWrapper.classList.remove('fade-in');
  tableWrapper.classList.remove('fade-out');
  $('#example').addClass('fade').removeClass('show');
  setTimeout(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Tampilkan tanggal jika data ada
        const rawDate = new Date(data.tanggal);
        const options = {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        };
        const formattedDate = rawDate.toLocaleDateString('id-ID', options);
        const sanitizedDate = formattedDate.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
        document.getElementById("date").textContent = `${formattedDate}`;
        // Memastikan jika DataTable sudah diinisialisasi
        if (!table) {
          // Filter data berdasarkan hari
          table = $("#example").DataTable({
            ajax: url,
            dom: 'Bfrtip',
            buttons: [
              {
              },
              {
                extend: 'excel',
                text: 'Export Excel',
                title: `HARIAN KBM SMKN 8 BONE - ${sanitizedDate}`,
                exportOptions: {
                  columns: ':visible'
                },
                customize: function (xlsx) {
                  const sheet = xlsx.xl.worksheets['sheet1.xml'];
                  $('row c[r^="A"]', sheet).attr('s', '42');
                }
              }
            ],
            pageLength: -1, // Tampilkan semua data secara default
            columns: [
              {
                title: "NO",
                data: "1",
                className: "text-center",
              },
              {
                title: "KELAS",
                data: "2",
                className: "text-center",
              },
              {
                title: "MULAI JAM KE",
                data: "3",
                class: "text-center",
              },
              {
                title: "NAMA GURU MAPEL",
                data: "4",
              },
              {
                title: "MATA PELAJARAN",
                data: "5",
              },
              {
                title: "NAMA WALI KELAS",
                data: "6",
              },
              {
                title: "HADIR",
                data: "7",
                className: "text-center",
              },
              {
                title: "SAKIT",
                data: "8",
                className: "text-center",
              },
              {
                title: "IZIN",
                data: "9",
                className: "text-center",
              },
              {
                title: "ALPA",
                data: "10",
                className: "text-center",
              },
              {
                title: "KONDISI KELAS",
                data: "11",
              },
              {
                title: "DOKUMENTASI 1",
                data: "12",
                render: renderDoc
              },
              // {
              //   title: "DOKUMENTASI 2",
              //   data: "13",
              //   render: renderDoc
              // },
              // {
              //   title: "DOKUMENTASI 3",
              //   data: "14",
              //   render: renderDoc
              // },
              // {
              //   title: "DOKUMENTASI 4",
              //   data: "15",
              //   render: renderDoc
              // },
              {
                title: "PIKET PENGGANTI",
                data: "16",
              }
            ],
            rowId: "KELAS",
            liveAjax: true,
            createdRow: function (row, data, dataIndex) {
              // Periksa Semua sel dalam Menu
              let hasNoData = false;
              $('td', row).each(function (index, cell) {
                if ($(cell).text() === "?") {
                  hasNoData = true;
                }
              });
              if (hasNoData) {
                $(row).addClass('bg-danger text-white');
              } else {
                $(row).removeClass('bg-danger text-white');
              }
            },
          });
          setInterval(function () {
            table.ajax.reload(null, false);
          }, 2000);
          table.on('xhr', function () {
            loadingData.classList.add("fade-out");
            setTimeout(() => {
              loadingData.style.display = "none";
              loadingData.style.zIndex = "-1";
            }, 1000);
          });
        } else {
          table.clear();
          table.rows.add(data.data).draw();
          loadingData.classList.add("fade-out");
          setTimeout(() => {
            loadingData.style.display = "none";
            loadingData.style.zIndex = "-1";
          }, 1000);
        }
        $('#example').removeClass('fade').addClass('fade show');
      }).catch(error => {
        console.error("Ada yang salah nih BOSKUU:", error);
      });
  }, 500);
}

function renderDoc(data) {
  if (!data || data === "?") {
    return "?";
  }
  const imageUrl = data.replace("https://drive.google.com/open?id=", "https://drive.google.com/thumbnail?id=");
  const cachedImage = localStorage.getItem(imageUrl);
  if (cachedImage) {
    return `
        <div class="text-center">
          <a href="${data}" target="_blank">
            <img src ="${cachedImage}" alt="Dokumentasi" id="imgFluid" class="img-fluid">      
          </a>
        </div>
    `;
  } else {
    const img = new Image();
    img.src = imageUrl;
    img.classList.add("img-fluid");
    img.onload = () => {
      try {
        localStorage.setItem(imageUrl, img.src);
      } catch (error) {
        console.warn("LocalStorage Penuh atau error: ", error);
      }
    };
    return `
        <div class="text-center">
          <a href="${data}" target="_blank">
            <img src ="${imageUrl}" alt="Dokumentasi" id="imgFluid" class="img-fluid">      
          </a>
        </div>
    `;
  }
}

function setDefaultDay() {
  const today = new Date().getDay();
  const defaultDay = days[today === 0 ? 6 : today];
  fetchData(defaultDay);
  $("#floatingSelect").val(defaultDay).trigger("change");
}

function printPage() {
  const win = window.open('', '_blank');
  let printContent = `
    <html>
    <head>
      <title>Laporan KBM Harian SMKN 8 Bone</title>
      <link rel="stylesheet" href="/assets/compiled/css/app.css">
    </head>
    <body class="bg-white">
      <div class="d-flex justify-content-between m-5">
        <img src="/assets/images/LOGO PROVINSI.png" width="100">
        <div class="text-center">
          <h1>Laporan KBM Harian SMKN 8 Bone</h1>
          <h4>${document.getElementById("date").textContent}</h4>
        </div>
        <img src="/assets/images/LOGO SEKOLAH.png" width="100">
      </div>
    
      <table class="table table-bordered">
        <thead>${document.querySelector("#example thead").innerHTML}</thead>
        <tbody>
  `;
  let imageLoadPromises = [];
  document.querySelectorAll("#example tbody tr").forEach(row => {
    let rowData = "<tr>";
    row.querySelectorAll("td").forEach((td) => {
      let cellContent = td.innerHTML;
      let imgTag = td.querySelector("img");
      if (imgTag) {
        let originalSrc = imgTag.src;
        let cachedSrc = localStorage.getItem(originalSrc);
        if (cachedSrc) {
          cellContent = `<img src="${cachedSrc}" class="img-fluid">`;
        }
      }
      rowData += `<td>${cellContent}</td>`;
    });
    rowData += "</tr>";
    printContent += rowData;
  });
  printContent += `
        </tbody>
      </table>
      <script src="/assets/extensions/jquery/jquery.min.js"></script>
      <script src="/assets/extensions/bootstrap/dist/js/bootstrap.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
      <script src="/assets/extensions/datatables.net/js/jquery.dataTables.min.js"></script>
      <script src="/assets/extensions/datatables.net-bs5/js/dataTables.bootstrap5.min.js"></script>
      <script src="/assets/static/js/pages/datatables.js"></script>
    </body>
    </html>
  `;
  win.document.open();
  win.document.write(printContent);
  win.document.close();
  // Tunggu gambar dimuat sebelum mencetak
  Promise.all(imageLoadPromises).then(() => {
    setTimeout(() => win.print(), 1000);
  });
}

function exportPage() {
  table.button(1).trigger();
}

fetchData();
setDefaultDay();

$("#floatingSelect").change(function () {
  fetchData($(this).val());
});

$("#floatingInput").on("keyup", function () {
  table.search(this.value).draw();
});