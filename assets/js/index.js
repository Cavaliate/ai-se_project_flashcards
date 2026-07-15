import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselDeckView } from "./carousel.js";

const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const mainEl = document.querySelector(".pagemain-content");

function renderHomeView() {
  homeSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  const deckTemplateEl = document.querySelector("#decks__flash-card-template");
  const decksContainer = document.querySelector(".decks__flash-cards");

  function createDeckEl(deck) {
    const deckContainer = deckTemplateEl.content.cloneNode(true);
    const deckEl = deckContainer.querySelector(".deck");
    const deckTitleEl = deckEl.querySelector(".decks__titles");
    const deckCountEl = deckEl.querySelector(".card-count");
    const deleteBtn = deckEl.querySelector(".decks__delete-btn");
    const deckColor = deck.color;

    const deckLink = deckContainer.querySelector(".deck__link");
    deckLink.href = `#carousel/${deck.id}`;

    deckTitleEl.textContent = deck.name;
    deckCountEl.textContent = `${deck.cards.length} cards`;

    const cardEl = deckEl.querySelector(".decks__flash-card");
    if (cardEl && deck.color) {
      cardEl.style.backgroundColor = deck.color;
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
function renderNotFoundView() {
  homeSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
}
function router() {
  const hash = window.location.hash.slice(1) || "home";
  mainEl.classList.remove("pagemain-content_carousel"); 

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("carousel/")) {
    homeSection.style.display = "none";
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";
    mainEl.classList.add("pagemain-content_carousel");
    const deckId = hash.split("/")[1];
    const currentDeck = getDeckByID(deckId);
    if (!currentDeck) {
      renderNotFoundView();
      return;
    } else {
      renderCarouselDeckView(currentDeck);
    }
  } else {
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
