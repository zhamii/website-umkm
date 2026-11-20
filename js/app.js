"use strict";

console.log("P10 Javascript aktif");

const produkUmkm = [
  { nama: "Kopi Tubruk", kategori: "Coffee", harga: 28000, stok: 15, unggulan: true, diskonPersen: 10, deskripsi: "Kopi lokal dengan aroma kuat dan rasa klasik." },
  { nama: "Caffe Latte", kategori: "Coffee", harga: 35000, stok: 4, unggulan: false, diskonPersen: 0, deskripsi: "Espresso lembut dengan creamy milk." },
  { nama: "Cold Brew", kategori: "Coffee", harga: 32000, stok: 14, unggulan: true, diskonPersen: 0, deskripsi: "Smooth, fresh, dan tidak terlalu pahit." },
  { nama: "Matcha Latte", kategori: "Non Coffee", harga: 38000, stok: 0, unggulan: false, diskonPersen: 0, deskripsi: "Matcha creamy dengan rasa earthy yang lembut." },
  { nama: "Roti Bakar Cokelat", kategori: "Makanan", harga: 18000, stok: 20, unggulan: false, diskonPersen: 0, deskripsi: "Roti bakar hangat dengan lelehan cokelat." },
  { nama: "Kentang Goreng", kategori: "Makanan", harga: 20000, stok: 3, unggulan: false, diskonPersen: 0, deskripsi: "Kentang goreng renyah, teman nongkrong yang pas." },
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

// Selector DOM. Script ini dimuat di semua halaman, jadi hasilnya bisa null.
const produkGrid = document.querySelector("#produk-dinamis");
const produkStatus = document.querySelector("#produk-ringkasan");
const produkUnggulanInfo = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

// Input: satu object produk. Output: satu elemen DOM kartu (belum dimasukkan ke halaman).
function buatElemenProduk(produk) {
  const status = statusStok(produk.stok);
  const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
  const adaDiskon = hargaAkhir < produk.harga;

  const card = document.createElement("article");
  card.classList.add("js-product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const desc = document.createElement("p");
  desc.textContent = produk.deskripsi;

  card.append(title, category, desc);

  if (adaDiskon) {
    const hargaCoret = document.createElement("p");
    hargaCoret.classList.add("price");

    const hargaLama = document.createElement("s");
    hargaLama.classList.add("price-old");
    hargaLama.textContent = formatRupiah(produk.harga);

    const diskon = document.createElement("span");
    diskon.classList.add("discount-badge");
    diskon.textContent = `-${produk.diskonPersen}%`;

    hargaCoret.append(hargaLama, " ", diskon);
    card.append(hargaCoret);
  }

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(hargaAkhir);

  const stock = document.createElement("span");
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  // Latihan remove(): hanya menghapus kartu dari tampilan, data produkUmkm tidak berubah.
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("ghost-button");
  removeButton.textContent = "Sembunyikan";
  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan. Data asli belum berubah.";
  });

  card.append(price, stock, removeButton);
  return card;
}

function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
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

function renderProduk(kategoriAktif = "Semua") {
  // Bukan halaman produk: tidak ada yang perlu dirender.
  if (!produkGrid || !produkStatus || !produkUnggulanInfo) {
    return;
  }

  const produkTampil =
    kategoriAktif === "Semua"
      ? produkUmkm
      : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);

  console.log("Render kategori:", kategoriAktif);
  console.table(produkTampil);

  // Kosongkan hasil render lama agar kartu tidak dobel.
  produkGrid.replaceChildren();

  produkUnggulanInfo.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = `Kategori ${kategoriAktif} menampilkan 0 produk dari ${produkUmkm.length} total produk.`;
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent =
    kategoriAktif === "Semua"
      ? `${produkTampil.length} produk ditampilkan. (${ringkasKategori(produkUmkm)})`
      : `Kategori ${kategoriAktif} menampilkan ${produkTampil.length} produk dari ${produkUmkm.length} total produk.`;
}

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });
    tombolAktif.classList.add("is-active");
    tombolAktif.setAttribute("aria-pressed", "true");

    renderProduk(kategori);
  });
});

// app.js dimuat dengan defer, jadi DOM sudah siap saat baris ini jalan.
renderProduk();