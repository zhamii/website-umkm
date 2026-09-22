const promoButton = document.querySelector("#promoButton");
const filterButtons = document.querySelectorAll(".filter");
const menuCards = document.querySelectorAll(".card");

if (promoButton) {
  promoButton.addEventListener("click", () => {
    promoButton.textContent = "Promo: Beli 2 gratis tester!";
    console.log("Promo Sela Coffee berhasil ditampilkan.");
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    filterButtons.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");

    menuCards.forEach((card) => {
      const showCard = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !showCard);
    });
  });
});