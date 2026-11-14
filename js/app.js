"use strict";

console.log("P10 Javascript aktif");

const produkUmkm = [
  { nama: "Kopi Tubruk", kategori: "Coffee", harga: 28000, stok: 15, unggulan: true, diskonPersen: 10, deskripsi: "Kopi lokal dengan aroma kuat dan rasa klasik." },
  { nama: "Caffe Latte", kategori: "Coffee", harga: 35000, stok: 4, unggulan: false, diskonPersen: 0, deskripsi: "Espresso lembut dengan creamy milk." },
  { nama: "Cold Brew", kategori: "Coffee", harga: 32000, stok: 14, unggulan: true, diskonPersen: 0, deskripsi: "Smooth, fresh, dan tidak terlalu pahit." },
  { nama: "Matcha Latte", kategori: "Non Coffee", harga: 38000, stok: 0, unggulan: false, diskonPersen: 0, deskripsi: "Matcha creamy dengan rasa earthy yang lembut." },
];

// Input: angka. Output: teks rupiah. Tidak mengubah DOM.
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "warning" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

function hitungHargaAkhir(harga, diskonPersen) {
  const hargaValid = Number.isFinite(harga) && harga >= 0;
  const diskonValid =
    Number.isFinite(diskonPersen) && diskonPersen >= 0 && diskonPersen <= 100;

  if (!hargaValid || !diskonValid) {
    console.warn(
      `[validasi] Data tidak valid: harga=${harga}, diskonPersen=${diskonPersen}. Memakai harga normal.`
    );
    return hargaValid ? harga : 0;
  }

  return Math.round(harga - (harga * diskonPersen) / 100);
}

function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
  const adaDiskon = hargaAkhir < produk.harga;
  const blokHarga = adaDiskon
    ? `<p class="price"><s class="price-old">${formatRupiah(produk.harga)}</s> <span class="discount-badge">-${produk.diskonPersen}%</span></p>
       <p class="price">${formatRupiah(hargaAkhir)}</p>`
    : `<p class="price">${formatRupiah(produk.harga)}</p>`;

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p class="category-note">${produk.kategori}</p>
      <p>${produk.deskripsi}</p>
      ${blokHarga}
      <span class="stock-badge ${status.className}">${status.label}</span>
    </article>
  `;
}

function ringkasKategori(daftarProduk) {
  const hitung = {};

  daftarProduk.forEach((produk) => {
    hitung[produk.kategori] = (hitung[produk.kategori] || 0) + 1;
  });

  return Object.entries(hitung)
    .map(([kategori, jumlah]) => `${kategori}: ${jumlah} produk`)
    .join(", ");
}

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  // Bukan halaman produk: tidak ada yang perlu dirender.
  if (!grid || !ringkasan || !unggulan) {
    return;
  }

  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });
  console.table(produkUmkm);

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");

  console.log("Jumlah produk tersedia:", produkTersedia.length);

  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data. (${ringkasKategori(produkUmkm)})`;
  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";
}

document.addEventListener("DOMContentLoaded", renderProduk);