import { decks, getDeckByID } from "./cards.js";
import { renderCarouselDeckView } from "./carousel.js";
import { removeColorClasses } from "./colors.js";
import { renderDeckView as renderDeckViewModule } from "./deck-view.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const mainEl = document.querySelector(".pagemain-content");

function renderHomeView() {
  homeSection.style.display = "block";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

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
        deckEl.remove();
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
  renderDeckViewModule(deck, {
    homeSection,
    deckViewSection,
    carouselSection,
    notFoundSection,
  });
}

function renderNotFoundView() {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
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
    homeSection.style.display = "none";
    deckViewSection.style.display = "none";
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";
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
