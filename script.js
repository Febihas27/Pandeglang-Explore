document.addEventListener("DOMContentLoaded", function () {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});
// Inisialisasi peta
const map = L.map('mapid').setView([-6.3282, 105.8636], 11);
// Basemap: OpenStreetMap
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map); // Default aktif
// Basemap: Esri World Imagery (citra satelit)
const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
});
// Control Layer untuk memilih basemap
const baseMaps = {
  "OpenStreetMap": osm,
  "Esri Satellite": esriSat,
};

// 1) Load data wisata
// a) Pantai
let pantaiLayer;
// Objek overlays yang nanti diisi layer-layer wisata, dimulai dari pantai
const overlays = {};
// Fetch data Pantai dan buat layer-nya
fetch("Asset/Data/Pantai.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON Data Pantai");
    }
    return response.json();
  })
  .then(data => {
    pantaiLayer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'Asset/PANTAI.png',
            iconSize: [40, 20],
            iconAnchor: [25, 60],
            popupAnchor: [0, -30]
          })
        });
      },
      onEachFeature: function(feature, layer) {
        const namaAsli = feature.properties.Pantai || "Pantai";
        const nama = namaAsli.trim().toLowerCase();
        let alamat = "-";
        let gambar = "";

        // Identifikasi pantai berdasarkan nama
        if (nama.includes("pasir putih") && nama.includes("carita")) {
          alamat = "Jl. Perintis kemerdekaan, Sukajadi, Kec. Carita, Kabupaten Pandeglang, Banten 42264";
          gambar = "Asset/Pantai Carita.jpg";
        } else if (nama.includes("daplang") || nama.includes("sumur")) {
          alamat = "Kertajaya, Sumur, Pandeglang Regency, Banten";
          gambar = "Asset/Pantai Daplangu.jpeg";
        } else if (nama.includes("tanjung lesung")) {
          alamat = "Kp. Cikadu Indah, RT.002/RW.001, Tanjungjaya, Kec. Panimbang, Kabupaten Pandeglang, Banten 42281";
          gambar = "Asset/TJ.png";
        } else if (nama.includes("pandan") && nama.includes("carita")) {
          alamat = "Jl. Raya Carita No.29, Sukajadi, Kec. Carita, Kabupaten Pandeglang, Banten 42264";
          gambar = "Asset/Pandan.jpg";
        }

        // Buat popup dengan nama, alamat dan gambar
        let popupContent = `
          <div style="min-width:200px">
            <strong style="font-size:16px">${namaAsli}</strong><br>
            <b>Alamat:</b> ${alamat}
        `;

        if (gambar) {
          popupContent += `
            <br><img src="${gambar}" alt="${namaAsli}"
            style="width:100%; margin-top:8px; border-radius:8px;">
          `;
        }

        popupContent += `</div>`;
        layer.bindPopup(popupContent);
      }
    });

    // Tambahkan layer Pantai ke overlays supaya bisa dikontrol nyala/mati
    overlays["Pantai"] = pantaiLayer;

    // Jika ingin layer Pantai default aktif, tambahkan ke peta
    pantaiLayer.addTo(map);
  })
  .catch(error => {
    console.error("Error memuat data Pantai:", error);
  });


//b) Pulau
fetch("Asset/Data/Pulau.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON Data Pulau");
    }
    return response.json();
  })
  .then(data => {
    const pulauGeoJson = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'Asset/PULAU.png',  // ganti dengan path ikon kamu
            iconSize: [80, 50],
            iconAnchor: [25, 60],
            popupAnchor: [0, -30]
          })
        });
      },
      onEachFeature: function(feature, layer) {
  console.log('Feature properties:', feature.properties);

  // Ambil properti nama dari 'Pulau'
  let nama = (feature.properties.Pulau || "Pulau").trim();
  let alamat = feature.properties.alamat || "-";

  const lowerNama = nama.toLowerCase();

  if (lowerNama === "pulau umang") {
    alamat = "Sumberjaya, Sumur, Pandeglang Regency, Banten";
  } else if (lowerNama === "pulau liwungan") {
    alamat = "Citeureup, Panimbang, Pandeglang Regency, Banten";
  } else if (lowerNama === "pulau panaitan") {
    alamat = "Ujungjaya, Sumur, Pandeglang Regency, Banten";
  }

  let popupContent = `
    <div style="min-width:200px">
      <strong style="font-size:16px">${nama}</strong><br>
      <b>Alamat:</b> ${alamat}
  `;

  if (lowerNama === "pulau umang") {
    popupContent += `
      <br><img src="Asset/Umang.jpeg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  } else if (lowerNama === "pulau liwungan") {
    popupContent += `
      <br><img src="Asset/liwungan.jpeg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  } else if (lowerNama === "pulau panaitan") {
    popupContent += `
      <br><img src="Asset/Panaitan.jpg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  }

  popupContent += `</div>`;

  layer.bindPopup(popupContent);
      }
    });
    // Tambahkan layer Pulau ke overlays supaya bisa dikontrol nyala/mati
    overlays["Pulau"] = pulauGeoJson;
    // Jika ingin layer Pulau default aktif, tambahkan ke peta
    pulauGeoJson.addTo(map);
  })
  .catch(error => {
    console.error("Error memuat data Pulau:", error);
  });


//c) Gunung
fetch("Asset/Data/Gunung.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON Data Gunung");
    }
    return response.json();
  })
  .then(data => {
    const gunungGeoJson = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'Asset/GUNUNG.png',  // ganti dengan path ikon kamu
            iconSize: [70, 40],
            iconAnchor: [25, 60],
            popupAnchor: [0, -30]
          })
        });
      },
      onEachFeature: function(feature, layer) {
  console.log('Feature properties:', feature.properties);

  // Ambil properti nama dari 'Gunung'
  let nama = (feature.properties.Gunung || "Gunung").trim();
  let alamat = feature.properties.alamat || "-";

  const lowerNama = nama.toLowerCase();

  if (lowerNama === "gunung karang") {
    alamat = "Saninten, Kaduhejo, Pandeglang Regency, Banten";
  } else if (lowerNama === "gunung pulosari") {
    alamat = "Pasireurih, Cipeucang, Pandeglang Regency, Banten";
  } else if (lowerNama === "gunung aseupan") {
    alamat = "Sikulan, Jiput, Pandeglang Regency, Banten";
  }

  let popupContent = `
    <div style="min-width:200px">
      <strong style="font-size:16px">${nama}</strong><br>
      <b>Alamat:</b> ${alamat}
  `;

  if (lowerNama === "gunung karang") {
    popupContent += `
      <br><img src="Asset/Karang.jpeg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  } else if (lowerNama === "gunung pulosari") {
    popupContent += `
      <br><img src="Asset/Pulosari.jpg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  } else if (lowerNama === "gunung aseupan") {
    popupContent += `
      <br><img src="Asset/Aseupan.jpg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  }

  popupContent += `</div>`;

  layer.bindPopup(popupContent);
      }
    });
   // Tambahkan layer Gunung ke overlays supaya bisa dikontrol nyala/mati
    overlays["Gunung"] = gunungGeoJson;
    // Jika ingin layer Gunung default aktif, tambahkan ke peta
    gunungGeoJson.addTo(map);
  })
  .catch(error => {
    console.error("Error memuat data Gunung:", error);
  });


// d) Air Terjun
fetch("Asset/Data/Air Terjun.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON Data Air Terjun");
    }
    return response.json();
  })
  .then(data => {
    const curugGeoJson = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'Asset/CURUG.png',
            iconSize: [60, 40],
            iconAnchor: [25, 60],
            popupAnchor: [0, -30]
          })
        });
      },
      onEachFeature: function(feature, layer) {
        const namaAsli = feature.properties.Air_Terjun || "Air Terjun";
        const nama = namaAsli.trim().toLowerCase();
        let alamat = "-";
        let gambar = "";

        // Pencocokan untuk 3 air terjun spesifik
        if (nama.includes("putri") && nama.includes("carita")) {
          alamat = "Jl. Desa, RT.14/RW.04, Sukarame, Kec. Carita, Kabupaten Pandeglang, Banten 42264";
          gambar = "Asset/Curug Putri.jpeg";
        } else if (nama.includes("goong")) {
          alamat = "Jl. Raya Mandalawangi No.16, Kurungkambing, Kec. Mandalawangi, Kabupaten Pandeglang, Banten 42271";
          gambar = "Asset/Curug goong.jpeg";
        } else if (nama.includes("sawer") || nama.includes("cigeulis")) {
          alamat = "CM5X+FC5, Cigeulis, Pandeglang Regency, Banten 42282";
          gambar = "Asset/Curug sawe.jpg";
        }

        // Konten popup
        let popupContent = `
          <div style="min-width:200px">
            <strong style="font-size:16px">${namaAsli}</strong><br>
            <b>Alamat:</b> ${alamat}
        `;

        if (gambar) {
          popupContent += `
            <br><img src="${gambar}" alt="${namaAsli}" 
            style="width:100%; margin-top:8px; border-radius:8px;">
          `;
        }

        popupContent += `</div>`;
        layer.bindPopup(popupContent);
      }
    });

    // Tambahkan ke overlays agar bisa dikontrol manual
    overlays["Air Terjun"] = curugGeoJson;

    // Tampilkan langsung
    curugGeoJson.addTo(map);
  })
  .catch(error => {
    console.error("Error memuat data Air Terjun:", error);
  });


// e) Hutan
fetch("Asset/Data/Hutan.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON Data Hutan");
    }
    return response.json();
  })
  .then(data => {
    const hutanGeoJson = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'Asset/HUTAN.png', // pastikan benar jalur ini
            iconSize: [60, 40],
            iconAnchor: [30, 40], // anchor di dasar icon
            popupAnchor: [0, -35]
          })
        });
      },
  onEachFeature: function(feature, layer) {
  console.log('Feature properties:', feature.properties);

  // Ambil properti nama dari 'Hutan'
  let nama = (feature.properties.Hutan || "Hutan").trim();
  let alamat = feature.properties.alamat || "-";

  const lowerNama = nama.toLowerCase();

  if (lowerNama === "forest park (tahura)") {
    alamat = "Sukarame, Carita, Pandeglang Regency, Banten 42264";
  } else if (lowerNama === "taman nasional ujung kulon") {
    alamat = "Ujungjaya, Sumur, Pandeglang Regency, Banten";
  }

  let popupContent = `
    <div style="min-width:200px">
      <strong style="font-size:16px">${nama}</strong><br>
      <b>Alamat:</b> ${alamat}
  `;

  if (lowerNama === "forest park (tahura)") {
    popupContent += `
      <br><img src="Asset/Tahura.jpg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  } else if (lowerNama === "taman nasional ujung kulon") {
    popupContent += `
      <br><img src="Asset/Badak.jpg" alt="${nama}" 
      style="width:100%; margin-top:8px; border-radius:8px;">
    `;
  }

  popupContent += `</div>`;

  layer.bindPopup(popupContent);
}
    });

    overlays["Hutan"] = hutanGeoJson;
    hutanGeoJson.addTo(map);
  })
  .catch(error => {
    console.error("Error memuat data Hutan:", error);
  });

  
// 2) Load data GeoJSON Fasilitas Kesehatan
// Pastikan FaskesLayer sudah ditambahkan ke map sebelumnya
const FaskesLayer = L.layerGroup().addTo(map);
// Fetch data GeoJSON Rumah Sakit
fetch("Asset/Data/Rumah Sakit.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON Fasilitas Kesehatan");
    }
    return response.json();
  })
  .then(data => {
    const faskesGeoJson = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'Asset/Rumahsakit.png',
            iconSize: [50, 30],
            iconAnchor: [25, 30],
            popupAnchor: [0, -30]
          })
        });
      },
      onEachFeature: function (feature, layer) {
        const props = feature.properties || {};
        const nama = props.NAMOBJ || "Rumah Sakit";
        const jenis = props.jenis || "Tidak diketahui";
        let alamat = props.alamat || "Alamat tidak tersedia";

        // Alamat khusus RSUD Berkah
        if (nama.trim().toLowerCase() === "rumah sakit umum berkah pandeglang") {
          alamat = "Jl. KH. Abdul Halim No.Km.5, Palurahan, Cikoneng, Kabupaten Pandeglang, Banten 42252";
        }

        // Alamat khusus RS Alinda Husada
        if (nama.trim().toLowerCase() === "rumah sakit alindahusada") {
          alamat = "Jl. Raya Tj. Lesung No.KM 01, Panimbangjaya, Kec. Panimbang, Kabupaten Pandeglang, Banten 42281";
        }

        let popupContent = `
          <div style="min-width:200px">
            <strong style="font-size:16px">${nama}</strong><br>
            <b>Jenis:</b> ${jenis}<br>
            <b>Alamat:</b> ${alamat}
        `;

        // Gambar RSUD Berkah
        if (nama.trim().toLowerCase() === "rumah sakit umum berkah pandeglang") {
          popupContent += `
            <br><img src="Asset/RSUD.jpeg" alt="${nama}" 
            style="width:100%; margin-top:8px; border-radius:8px;">
          `;
        }

        // Gambar RS Alindahusada
        if (nama.trim().toLowerCase() === "rumah sakit alindahusada") {
          popupContent += `
            <br><img src="Asset/Alinda.jpg" alt="${nama}" 
            style="width:100%; margin-top:8px; border-radius:8px;">
          `;
        }

        popupContent += `</div>`;

        layer.bindPopup(popupContent);
      }
    });

    // Masukkan ke kontrol layer jika ada
    if (typeof overlays !== "undefined") {
      overlays["Rumah Sakit"] = faskesGeoJson;
    }

    // Tambahkan ke grup layer
    faskesGeoJson.addTo(FaskesLayer);
  })
  .catch(error => {
    console.error("Error memuat data Faskes:", error);
  });

// b) Puskesmas
fetch("Asset/Data/Puskesmas.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON Puskesmas");
    }
    return response.json();
  })
  .then(data => {
    const faskesGeoJson = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'Asset/puskesmas.png',
            iconSize: [25, 25],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
          })
        });
      },
      onEachFeature: function(feature, layer) {
        const nama = feature.properties.nama || "Fasilitas Kesehatan";
        const jenis = feature.properties.jenis || "Tidak diketahui";
        const alamat = feature.properties.alamat || "-";
        layer.bindPopup(`
          <strong>${nama}</strong><br>
          Jenis: ${jenis}<br>
          Alamat: ${alamat}
        `);
      }
    });
    overlays["Puskesmas"] = faskesGeoJson;
    faskesGeoJson.addTo(FaskesLayer);
  })
  .catch(error => {
    console.error("Error memuat data Faskes:", error);
  });

// 3) Layer Group untuk batas administrasi
const BatasAdministrasi = L.layerGroup().addTo(map);
// Batas Administrasi Ke
fetch("Asset/Data/Batas Admin.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal memuat GeoJSON");
    }
    return response.json();
  })
  .then(data => {
    const batasLayer = L.geoJSON(data, {
      style: function(feature) {
        const tipe = (feature.properties.tipe || "").toLowerCase();

        // Semua batas administrasi (standar BIG)
        return {
          color: "black",                    // Warna hitam
          weight: 3,                       // Ketebalan garis
          dashArray: "3,6,3,6,3,6,10,6",     // Pola titik-titik-titik-garis
          fill: false,
          opacity: 1
        };
      },

      onEachFeature: (feature, layer) => {
        const nama = feature.properties.nama || "Batas Administrasi";
        const tipe = feature.properties.tipe || "Tidak diketahui";
        layer.bindPopup(`<strong>${nama}</strong><br><em>${tipe}</em>`);
      }
    });
    overlays["Batas Administrasi"] = BatasAdministrasi; // Setelah batas dibuat
    batasLayer.addTo(BatasAdministrasi);
  })
  .catch(error => {
    console.error("Error memuat Batas Administrasi:", error);
  });
  // 3) Jalan
function styleJalan(feature) {
  switch (feature.properties.kelas) {
    case 'utama': 
      return { color: 'red', weight: 5 };
    case 'sekunder': 
      return { color: 'orange', weight: 3 };
    case 'kecil': 
      return { color: 'yellow', weight: 2, dashArray: '4' };
    default: 
      return { color: 'gray', weight: 1 };
  }
}
//4) Load Jalan
fetch('Asset/Data/Jalan Baru.geojson')
  .then(res => res.json())
  .then(geojson => {

      // Filter fitur, kecuali yang remark = "Pematang" atau "jalan setapak"
    const fiturFiltered = {
      type: "FeatureCollection",
      features: geojson.features.filter(f => {
        const remark = (f.properties.REMARK || "").trim().toLowerCase();
        return remark !== "pematang" && remark !== "jalan setapak";
      })
    };

    // Fungsi style berdasarkan remark
    function style(feature) {
      switch ((feature.properties.REMARK || "").trim().toLowerCase()) {
        case 'jalan kolektor': return { color: "red", weight: 5 };
        case 'jalan lokal': return { color: "orange", weight: 4 };
        case 'jalan lain': return { color: "grey", weight: 2 };
      }
    }

    // Tambahkan ke peta
    const jalanLayer = L.geoJSON(fiturFiltered, {
      style: style,
      onEachFeature: (feature, layer) => {
        const nama = feature.properties.nama || 'Tidak ada nama';
        const remark = feature.properties.REMARK || 'Tidak ada remark';
        layer.bindPopup(`<b>${nama}</b><br>Tipe: ${remark}`);
      }
      
    }).addTo(map);
    overlays["Jalan"] = jalanLayer;
     // NOTE: Jika kamu punya kontrol layer lain yang sudah dibuat, pastikan ini hanya dipanggil sekali setelah semua overlays siap
    L.control.layers(baseMaps, overlays).addTo(map);
  })
  .catch(err => console.error('Error loading GeoJSON:', err));
  
//LEGENDA
 const legend = L.control({ position: "topleft" });

legend.onAdd = function (map) {
  const div = L.DomUtil.create("div", "info legend");

  // Styling container utama supaya ada padding, background putih, border, dan flex 2 kolom
    // Styling kontainer utama legenda
  Object.assign(div.style, {
    padding: "12px",
    background: "rgba(255, 255, 255, 0.3)", // ❗ Transparan putih
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    minWidth: "200px",       // cukup minimum
    maxWidth: "90%",         // tidak meluber
    width: "fit-content",     // ❗ ini kuncinya, biar lebarnya ngikut isi
  });

  // Judul legenda (full width)
  div.innerHTML += `<h4 style="font-size: 20px; font-weight: bold; margin-bottom: 10px; text-align: center; width: 100%;">Keterangan</h4>`;

  // Container 2 kolom
  const containerCols = document.createElement("div");
  containerCols.style.display = "flex";
  containerCols.style.justifyContent = "space-between";
  containerCols.style.gap = "10px";

  // Kolom 1
  const col1 = document.createElement("div");
  col1.style.flex = "0 0 48%";
  col1.style.display = "flex";
  col1.style.flexDirection = "column";

  // Kolom 2
  const col2 = document.createElement("div");
  col2.style.flex = "0 0 48%";
  col2.style.display = "flex";
  col2.style.flexDirection = "column";

  // Fungsi pembungkus simbol agar ikon dan garis sejajar vertikal
  function createSymbolWrapper(innerHtml) {
    return `
      <div style="
        width: 60px; 
        height: 30px; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        margin-right: 8px;
        flex-shrink: 0;
      ">
        ${innerHtml}
      </div>
    `;
  }

  // Isi kolom 1 (misalnya ikon wisata)
  col1.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 6px; font-size: 15px;">Wisata</div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      ${createSymbolWrapper('<img src="Asset/PANTAI.png" alt="Pantai" width="40" height="20" />')}
      <span style="font-size: 14px;">Pantai</span>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      ${createSymbolWrapper('<img src="Asset/PULAU.png" alt="Pulau" width="80" height="50" />')}
      <span style="font-size: 14px;">Pulau</span>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      ${createSymbolWrapper('<img src="Asset/GUNUNG.png" alt="Gunung" width="70" height="40" />')}
      <span style="font-size: 14px;">Gunung</span>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      ${createSymbolWrapper('<img src="Asset/CURUG.png" alt="Air Terjun" width="60" height="40" />')}
      <span style="font-size: 14px;">Air Terjun</span>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      ${createSymbolWrapper('<img src="Asset/HUTAN.png" alt="Hutan" width="60" height="40" />')}
      <span style="font-size: 14px;">Hutan</span>
    </div>
  `;

  // Isi kolom 2 (misalnya fasilitas kesehatan + batas jalan)
  col2.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 6px; font-size: 15px;">Fasilitas Kesehatan</div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      ${createSymbolWrapper('<img src="Asset/Rumahsakit.png" alt="Rumah Sakit" width="50" height="30" />')}
      <span style="font-size: 14px;">Rumah Sakit</span>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      ${createSymbolWrapper('<img src="Asset/puskesmas.png" alt="Puskesmas" width="24" height="24" />')}
      <span style="font-size: 14px;">Puskesmas</span>
    </div>
    <hr style="margin: 8px 0; border: 0; border-top: 1px solid #ccc;" />
    <div style="font-weight: bold; margin-bottom: 6px; font-size: 15px;">Batas Administrasi</div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      <div style="
        width: 60px; 
        height: 3px; 
        background-image: repeating-linear-gradient(
          to right,
          black, black 3px,
          transparent 3px, transparent 9px,
          black 9px, black 12px,
          transparent 12px, transparent 18px,
          black 18px, black 21px,
          transparent 21px, transparent 27px,
          black 27px, black 40px,
          transparent 40px, transparent 46px
        );
        margin-right: 8px;
      "></div>
      <span style="font-size: 14px;">Batas Administrasi Kecamatan</span>
    </div>
    <hr style="margin: 8px 0; border: 0; border-top: 1px solid #ccc;" />
    <div style="font-weight: bold; margin-bottom: 6px; font-size: 15px;">Jalan</div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      <div style="border-top: 5px solid red; height: 0; width: 60px; margin-right: 8px;"></div>
      <span style="font-size: 14px;">Jalan Kolektor</span>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      <div style="border-top: 4px solid orange; height: 0; width: 60px; margin-right: 8px;"></div>
      <span style="font-size: 14px;">Jalan Lokal</span>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 6px;">
      <div style="border-top: 2px solid grey; height: 0; width: 60px; margin-right: 8px;"></div>
      <span style="font-size: 14px;">Jalan Lain</span>
    </div>
  `;

  // Tambahkan kedua kolom ke container utama
  containerCols.appendChild(col1);
  containerCols.appendChild(col2);
  div.appendChild(containerCols);

  return div;
};

legend.addTo(map);
