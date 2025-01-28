const baseUrl = "https://script.google.com/macros/s/AKfycbwxxDPptmg0b4BlIJJ-pie4POoeMIJjQGFEsHj7oAHHTU3YEEK9c2CCQb1n2D4UxB5YOg/exec";
const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
const loadingData = document.getElementById("loading");

let table;

function fetchData(day) {
  let url = baseUrl;
  if (day) {
    url += `?day=${day}`;
  }

  const tabs = document.querySelectorAll('.nav-link');
  tabs.forEach(tab => tab.classList.remove('active'));

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
            dom: 'rtip',
            buttons: [
              {
                extend: 'print',
                title: '',
                customize: function (win) {
                  $(win.document.body).css('font-size', '10pt');
                  $(win.document.body).find('table').addClass('table table-bordered');

                  $(win.document.body).prepend(`
                      <div class="d-flex justify-content-between m-4">
                        <img src="./LOGO PROVINSI.png" width="75" height="75">
                        <div class="text-center">
                          <h1>Laporan KBM Harian SMKN 8 Bone</h1>
                          <h4>${formattedDate}</h4>
                        </div>
                        <img src="./LOGO SEKOLAH.png" width="75" height="75">
                      </div>
                    `);
                }
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
              {
                title: "DOKUMENTASI 2",
                data: "13",
                render: renderDoc
              },
              {
                title: "DOKUMENTASI 3",
                data: "14",
                render: renderDoc
              },
              {
                title: "DOKUMENTASI 4",
                data: "15",
                render: renderDoc
              },
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
        // swal("Error", "Terjadi kesalahan saat mengambil data", error);
      });
  }, 500);
}

function renderDoc(data) {
  if (!data || data === "?") {
    return "?";
  }
  console.log(data);
  const imageUrl = data.replace("https://drive.google.com/open?id=", "https://drive.google.com/thumbnail?id=");

  return `
      <div class="text-center">
        <a href="${data}" target="_blank">
          <img src ="${imageUrl}" alt="Dokumentasi" id="imgFluid" class="img-fluid">      
        </a>
      </div>
  `;
}

function setDefaultDay() {
  const today = new Date().getDay();
  const defaultDay = days[today === 0 ? 6 : today];
  fetchData(defaultDay);
  $("#floatingSelect").val(defaultDay).trigger("change");
}

function printPage() {
  table.button(0).trigger();
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