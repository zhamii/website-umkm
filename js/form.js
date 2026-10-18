const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  if (!preview) return;

  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `Nomor WhatsApp: ${data.get("telepon") || "Tidak diisi"}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu kontak: ${data.get("waktu")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");
});