import { decks, getDeckByID } from "./cards.js";
import { renderCarouselDeckView } from "./carousel.js";
import { removeColorClasses } from "./colors.js";
import { renderDeckView as renderDeckViewModule } from "./deck-view.js";
import { generateModal } from "./modal.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const mainEl = document.querySelector(".pagemain-content");
const pageElement = document.body;

export const openModal = generateModal({
  modalEl: document.querySelector("#confirmation-modal"),
  cancelBtnEl: document.querySelector(".modal__btn_type_cancel"),
  confirmBtnEl: document.querySelector(".modal__btn_type_confirm"),
  visibleClass: "modal_visible",
});

function showView(section, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  section.style.display = display;
}

function renderHomeView() {
  pageElement.classList.remove("page_no-mobile-bar");
  showView(homeSection, "block");
  const deckTemplateEl = document.querySelector(
    "#gallery__flash-card-template",
  );
  const decksContainer = homeSection.querySelector(".gallery__flash-cards");

  function createDeckEl(deck) {
    const deckContainer = deckTemplateEl.content.cloneNode(true);
    const deckEl = deckContainer.querySelector(".card");
    const deckTitleEl = deckEl.querySelector(".gallery__titles");
    const deckCountEl = deckEl.querySelector(".card-count");
    const deleteBtn = deckEl.querySelector(".gallery__delete-btn");
    const deckColor = deck.color;

    const deckLink = deckContainer.querySelector(".card__link");
    deckLink.href = `#deck/${deck.id}`;

    deckTitleEl.textContent = deck.name;
    deckCountEl.textContent = `${deck.cards.length} cards`;

    const cardEl = deckEl.querySelector(".gallery__flash-card");
    if (cardEl && deckColor) {
      cardEl.style.backgroundColor = deckColor;
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        openModal(() => {
          const idx = decks.findIndex((c) => c.id === deck.id);
          if (idx > -1) {
            decks.splice(idx, 1);
          }
          deckEl.remove();
        });
      });
    }

    return deckEl;
  }

  function renderDecks() {
    decks.forEach((deck) => {
      const flashDeck = createDeckEl(deck);
      decksContainer.append(flashDeck);
    });
  }

  decksContainer.textContent = "";
  renderDecks();
}

function renderDeckView(deck) {
  showView(deckViewSection, "block");
  renderDeckViewModule(deck, deckViewSection);
}

function renderNotFoundView() {
  pageElement.classList.remove("page_no-mobile-bar");
  showView(notFoundSection, "flex");
}

function router() {
  const hash = window.location.hash.slice(1) || "home";
  mainEl.classList.remove("pagemain-content_carousel");

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("deck/") || hash.startsWith("decks/")) {
    const deckId = hash.split("/")[1];
    const currentDeck = getDeckByID(deckId);
    if (!currentDeck) {
      renderNotFoundView();
      return;
    }
    renderDeckView(currentDeck);
  } else if (hash.startsWith("carousel/")) {
    showView(carouselSection, "flex");
    mainEl.classList.add("pagemain-content_carousel");
    const deckId = hash.split("/")[1];
    const currentDeck = getDeckByID(deckId);
    if (!currentDeck) {
      renderNotFoundView();
      return;
    }
    renderCarouselDeckView(currentDeck);
  } else {
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
