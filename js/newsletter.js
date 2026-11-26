"use strict";

// P12: newsletter ringan, simpan email terakhir di localStorage.
// IIFE + key sendiri supaya tidak bentrok dengan form.js.
(function () {
  const formNewsletter = document.querySelector("#form-newsletter");
  if (!formNewsletter) return;

  const NEWSLETTER_KEY = "sela-coffee-newsletter";
  const emailInput = document.querySelector("#newsletter-email");
  const errorEl = document.querySelector("#newsletter-error");
  const statusEl = document.querySelector("#newsletter-status");
  const tombolHapus = document.querySelector("#hapus-newsletter");

  function setStatus(teks, sukses = true) {
    statusEl.textContent = teks;
    statusEl.classList.toggle("success", sukses);
  }

  function pesanEmail() {
    if (emailInput.validity.valueMissing) return "Email wajib diisi.";
    if (emailInput.validity.typeMismatch) {
      return "Format email belum sesuai, contoh: nama@email.com.";
    }
    return "";
  }

  function simpanNewsletter(email) {
    const data = { email, subscribedAt: new Date().toISOString() };
    try {
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
      setStatus(`Terima kasih! ${email} tersimpan di browser ini (data dummy).`);
    } catch (error) {
      console.warn("Newsletter gagal disimpan.", error);
      setStatus("Gagal menyimpan (storage tidak tersedia).", false);
    }
  }

  function muatNewsletter() {
    try {
      const tersimpan = localStorage.getItem(NEWSLETTER_KEY);
      if (!tersimpan) return;

      const data = JSON.parse(tersimpan);
      if (!data || typeof data.email !== "string") {
        throw new Error("Bentuk data newsletter tidak valid.");
      }

      emailInput.value = data.email;
      setStatus(`Email terakhir: ${data.email}`);
    } catch (error) {
      console.warn("Data newsletter tidak valid.", error);
      localStorage.removeItem(NEWSLETTER_KEY);
      setStatus("Data newsletter rusak, sudah direset.", false);
    }
  }

  formNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();

    emailInput.setCustomValidity("");
    const pesan = pesanEmail();
    emailInput.setCustomValidity(pesan);
    emailInput.setAttribute("aria-invalid", pesan ? "true" : "false");
    errorEl.textContent = pesan;

    if (pesan) {
      setStatus("Periksa kembali email kamu.", false);
      emailInput.focus();
      return;
    }

    simpanNewsletter(emailInput.value.trim());
  });

  tombolHapus.addEventListener("click", () => {
    localStorage.removeItem(NEWSLETTER_KEY);
    formNewsletter.reset();
    emailInput.setCustomValidity("");
    emailInput.setAttribute("aria-invalid", "false");
    errorEl.textContent = "";
    setStatus("Data newsletter dihapus.");
  });

  muatNewsletter();
})();