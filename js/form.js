"use strict";

(function () {
  const form = document.querySelector("#form-kontak");
  if (!form) return;

  const preview = document.querySelector("#preview-form");
  const formFeedback = document.querySelector("#form-feedback");
  const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"]
    .map((id) => document.querySelector(`#${id}`))
    .filter(Boolean);
  const topikInputs = form.querySelectorAll('input[name="topik"]');
  const topikError = document.querySelector("#topik-error");

  const PREVIEW_AWAL =
    'Preview hanya muncul setelah semua data valid dan tombol "Kirim Pesan" diklik.';

  function getFieldError(field) {
    const validity = field.validity;

    if (validity.valueMissing) {
      if (field.type === "checkbox") return "Centang persetujuan dulu ya.";
      if (field.tagName === "SELECT") return "Pilih salah satu opsi.";
      return "Bagian ini wajib diisi.";
    }
    if (validity.typeMismatch) {
      return "Format email belum sesuai, contoh: nama@email.com.";
    }
    const terlaluPendek =
      field.minLength > 0 && field.value.length > 0 && field.value.length < field.minLength;
    if (validity.tooShort || terlaluPendek) {
      return `Isi minimal ${field.minLength} karakter (sekarang ${field.value.length}).`;
    }
    if (validity.patternMismatch) {
      return "Format nomor belum sesuai, contoh: 081234567890.";
    }

    return "";
  }

  function tampilkanError(field, pesan) {
    const error = document.querySelector(`#${field.id}-error`);
    field.setCustomValidity(pesan);
    field.setAttribute("aria-invalid", pesan ? "true" : "false");

    if (error) {
      error.textContent = pesan;
    }
  }

  function validasiField(field) {
    field.setCustomValidity(""); 
    const pesan = getFieldError(field);
    tampilkanError(field, pesan);
    return pesan === "";
  }

  function validasiTopik() {
    const terpilih = Array.from(topikInputs).some((input) => input.checked);
    const pesan = terpilih ? "" : "Pilih salah satu topik pertanyaan.";

    topikInputs.forEach((input) => {
      input.setAttribute("aria-invalid", terpilih ? "false" : "true");
    });
    if (topikError) topikError.textContent = pesan;

    return terpilih;
  }

  function tampilkanPreview() {
    const data = new FormData(form);

    preview.textContent = [
      `Nama: ${data.get("nama")}`,
      `Email: ${data.get("email")}`,
      `Nomor WhatsApp: ${data.get("telepon") || "Tidak diisi"}`,
      `Paket: ${data.get("paket")}`,
      `Waktu kontak: ${data.get("waktu")}`,
      `Topik: ${data.get("topik")}`,
      `Pesan: ${data.get("pesan")}`,
    ].join("\n");

    formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
    formFeedback.classList.add("success");
  }

  function resetPreview() {
    if (preview) preview.textContent = PREVIEW_AWAL;
  }


  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const semuaValid = fields.map(validasiField).every(Boolean);
    const topikValid = validasiTopik();

    if (!semuaValid || !topikValid || !form.checkValidity()) {
      formFeedback.textContent = "Periksa kembali bagian yang ditandai error.";
      formFeedback.classList.remove("success");
      resetPreview(); 
      form.reportValidity();
      form
        .querySelector("input:invalid, select:invalid, textarea:invalid")
        ?.focus(); 
      return;
    }

    tampilkanPreview();
  });

  fields.forEach((field) => {
    const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
    field.addEventListener(eventName, () => {
      if (field.getAttribute("aria-invalid") === "true") validasiField(field);
    });
  });
  topikInputs.forEach((input) => {
    input.addEventListener("change", validasiTopik);
  });

  const STORAGE_KEY = "sela-coffee-preferensi-kontak";
  const prefPaket = document.querySelector("#pref-paket");
  const prefChannels = document.querySelectorAll("input[data-channel]");
  const prefStatus = document.querySelector("#preferensi-status");
  const tombolSimpan = document.querySelector("#simpan-preferensi");
  const tombolHapus = document.querySelector("#hapus-preferensi");

  function setPrefStatus(teks, sukses = true) {
    if (!prefStatus) return;
    prefStatus.textContent = teks;
    prefStatus.classList.toggle("success", sukses);
  }

  function simpanPreferensi() {
    const preferensi = {
      paket: prefPaket.value,
      channel: Array.from(prefChannels)
        .filter((item) => item.checked)
        .map((item) => item.value),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
      console.log("Preferensi tersimpan:", preferensi);
      setPrefStatus("Preferensi tersimpan di browser ini.");
    } catch (error) {
      console.warn("Preferensi gagal disimpan.", error);
      setPrefStatus("Preferensi gagal disimpan (storage tidak tersedia).", false);
    }
  }

  function muatPreferensi() {
    try {
      const tersimpan = localStorage.getItem(STORAGE_KEY);
      if (!tersimpan) return;

      const preferensi = JSON.parse(tersimpan);
      if (typeof preferensi !== "object" || preferensi === null) {
        throw new Error("Bentuk data preferensi tidak valid.");
      }

      prefPaket.value = preferensi.paket ?? "";
      const channelTersimpan = Array.isArray(preferensi.channel) ? preferensi.channel : [];
      prefChannels.forEach((item) => {
        item.checked = channelTersimpan.includes(item.value);
      });

      const paketForm = document.querySelector("#paket");
      if (paketForm && !paketForm.value && preferensi.paket) {
        paketForm.value = preferensi.paket;
      }

      setPrefStatus("Preferensi dimuat dari penyimpanan browser.");
    } catch (error) {
      console.warn("Preferensi tidak valid.", error);
      localStorage.removeItem(STORAGE_KEY); // data rusak dibuang supaya tidak error terus
      setPrefStatus("Data preferensi rusak, sudah direset.", false);
    }
  }

  function hapusPreferensi() {
    localStorage.removeItem(STORAGE_KEY);
    prefPaket.value = "";
    prefChannels.forEach((item) => {
      item.checked = false;
    });
    setPrefStatus("Preferensi dihapus.");
  }

  if (prefPaket && tombolSimpan && tombolHapus) {
    tombolSimpan.addEventListener("click", simpanPreferensi);
    tombolHapus.addEventListener("click", hapusPreferensi);
    muatPreferensi();
  }

  console.log("Field form P12:", fields);
})();