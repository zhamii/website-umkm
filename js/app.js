"use strict";

console.log("P09 Javascript aktif");

const produkUmkm = [
  {
    nama: "Kopi Tubruk",
    kategori: "Coffee",
    harga: 28000,
    stok: 15,
    deskripsi: "Kopi lokal dengan aroma kuat dan rasa klasik.",
    unggulan: true,
    diskonPersen: 10,
  },
  {
    nama: "Caffe Latte",
    kategori: "Coffee",
    harga: 35000,
    stok: 4,
    deskripsi: "Espresso lembut dengan creamy milk.",
    unggulan: false,
    diskonPersen: 0,
  },
  {
    nama: "Cold Brew",
    kategori: "Coffee",
    harga: 32000,
    stok: 14,
    deskripsi: "Smooth, fresh, dan tidak terlalu pahit.",
    unggulan: true,
    diskonPersen: 0,
  },
  {
    nama: "Matcha Latte",
    kategori: "Non Coffee",
    harga: 38000,
    stok: 0,
    deskripsi: "Matcha creamy dengan rasa earthy yang lembut.",
    unggulan: false,
    diskonPersen: 0,
  },
];

console.table(produkUmkm);
console.log("Jumlah produk:", produkUmkm.length);

const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: `Stok terbatas (${stok})`, className: "warning" };
  }

  return { label: `Tersedia (${stok})`, className: "" };
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Coffee":
      return "Kategori: Coffee";
    case "Non Coffee":
      return "Kategori: Non Coffee";
    default:
      return "Produk UMKM";
  }
}

function labelUnggulan(produk) {
  const layakUnggulan = produk.unggulan && produk.stok > 0;
  return layakUnggulan ? "Produk unggulan" : "";
}

function hitungHargaAkhir(harga, diskonPersen) {
  const hargaValid = Number.isFinite(harga) && harga >= 0;
  const diskonValid = Number.isFinite(diskonPersen) && diskonPersen >= 0 && diskonPersen <= 100;

  if (!hargaValid || !diskonValid) {
    console.warn(`[validasi] Data tidak valid: harga=${harga}, diskonPersen=${diskonPersen}. Memakai harga normal.`);
    return hargaValid ? harga : 0;
  }

  const potongan = (harga * diskonPersen) / 100;
  return Math.round(harga - potongan);
}

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");

  if (!grid || !ringkasan) {
    return;
  }

  let jumlahTersedia = 0;
  let jumlahUnggulan = 0;
  let markup = "";

  for (const produk of produkUmkm) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);
    const unggulan = labelUnggulan(produk);
    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
    const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
    const adaDiskon = hargaAkhir < produk.harga;
    const blokHarga = adaDiskon
      ? `<p class="price"><s class="price-old">${formatRupiah.format(produk.harga)}</s> <span class="discount-badge">-${produk.diskonPersen}%</span></p>
        <p class="price">${formatRupiah.format(hargaAkhir)}</p>`
      : `<p class="price">${formatRupiah.format(produk.harga)}</p>`;

    if (produk.stok > 0) {
      jumlahTersedia += 1;
    }

    if (unggulan !== "") {
      jumlahUnggulan += 1;
    }

    console.log(`[debug] ${produk.nama} | stok=${produk.stok} | status=${status.label} | unggulan=${unggulan || "-"} | harga=${produk.harga} -> ${hargaAkhir}`);

    markup += `
      <article class="js-product-card">
        ${unggulan ? `<span class="featured-badge">${unggulan}</span>` : ""}
        <h3>${produk.nama}</h3>
        <p>${kategori}</p>
        <p>${produk.deskripsi}</p>
        ${blokHarga}
        <span class="stock-badge ${status.className}">${status.label}</span>
        <p>${labelAksi}</p>
      </article>
    `;
  }

  grid.innerHTML = markup;
  ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data, ${jumlahUnggulan} produk unggulan.`;
  console.log(`[debug] Render selesai: ${jumlahTersedia}/${produkUmkm.length} tersedia`);
}

document.addEventListener("DOMContentLoaded", renderProduk);