const promoButton = document.querySelector("#promoButton");
const filterButtons = document.querySelectorAll(".filter");
const menuCards = document.querySelectorAll(".card");

if (promoButton) {
  promoButton.addEventListener("click", () => {
    promoButton.textContent = "Promo: Beli 2 gratis tester!";
  });
}

const menuStatus = document.querySelector("#menu-status");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    let visibleCount = 0;

    filterButtons.forEach((filter) => {
      const isSelected = filter === button;
      filter.classList.toggle("active", isSelected);
      filter.setAttribute("aria-pressed", String(isSelected));
    });

    menuCards.forEach((card) => {
      const showCard = category === "all" || card.dataset.category === category;
      card.hidden = !showCard;
      visibleCount += Number(showCard);
    });

    if (menuStatus) {
      menuStatus.textContent = `Menampilkan ${visibleCount} produk.`;
    }
  });
});