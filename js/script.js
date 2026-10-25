const promoButton = document.querySelector("#promoButton");
const filterButtons = document.querySelectorAll(".filter");
const menuCards = document.querySelectorAll(".card");
const nav = document.querySelector(".nav");
const navMenu = document.querySelector("#nav-menu");
const navMenuToggle = document.querySelector(".nav-menu-toggle");

if (nav && navMenu && navMenuToggle) {
  const mobileViewport = window.matchMedia("(max-width: 59.999rem)");

  const setMenuState = (isOpen) => {
    navMenu.classList.toggle("is-open", isOpen);
    navMenuToggle.setAttribute("aria-expanded", String(isOpen));
    navMenuToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  };

  const updateMenuForViewport = () => {
    nav.classList.toggle("is-menu-collapsed", mobileViewport.matches);
    setMenuState(!mobileViewport.matches);
  };

  navMenuToggle.addEventListener("click", () => {
    setMenuState(navMenuToggle.getAttribute("aria-expanded") !== "true");
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a") && mobileViewport.matches) {
      setMenuState(false);
    }
  });

  mobileViewport.addEventListener("change", updateMenuForViewport);
  updateMenuForViewport();
}

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