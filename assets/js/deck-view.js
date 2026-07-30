import { removeColorClasses } from "./colors.js";

function renderDeckView(
  deck,
  { homeSection, deckViewSection, carouselSection, notFoundSection },
) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  const deckViewTitleEl = deckViewSection.querySelector(
    ".pagemain-content__my-decks",
  );
  const deckViewCardsContainer = deckViewSection.querySelector(
    ".gallery__flash-cards",
  );
  const cardTemplateEl = document.querySelector("#card-template");

  deckViewTitleEl.textContent = deck.name;

  const practiceBtn = deckViewSection.querySelector(".deck-view__practice-btn");
  if (practiceBtn) {
    practiceBtn.addEventListener("click", () => {
      window.location.hash = `#carousel/${deck.id}`;
    });
  }

  function createCardEl(card) {
    const cardContainer = cardTemplateEl.content.cloneNode(true);
    const cardEl = cardContainer.querySelector(".card");
    const cardTitleEl = cardEl.querySelector(".gallery__titles");
    const cardContentEl = cardEl.querySelector(".gallery__flash-card-contents");
    const cardCountEl = cardEl.querySelector(".card-count");
    const deleteBtn = cardEl.querySelector(".gallery__delete-btn");
    const cardLink = cardContainer.querySelector(".card__link");
    const cardColor = deck.color;

    if (cardLink) {
      cardLink.href = `#carousel/${deck.id}`;
    }

    // show question in title by default; answer is revealed when flipped
    cardTitleEl.textContent = card.question;
    cardContentEl.textContent = "";

    const cardSurface = cardEl.querySelector(".gallery__flash-card");
    if (cardSurface && cardColor) {
      cardSurface.style.backgroundColor = cardColor;
    }

    // wire up flip button to toggle answer
    const flipBtn = cardEl.querySelector(".card__flip-btn");
    flipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isFlipped = cardEl.classList.toggle("is-flipped");
      if (isFlipped) {
        // apply white carousel modifier and replace title with answer
        if (cardSurface) {
          removeColorClasses(cardSurface);
          cardSurface.style.backgroundColor = "";
          cardSurface.classList.add("card__carousel_color_white");
        }
        cardTitleEl.textContent = card.answer;
      } else {
        // restore original deck color and question title
        if (cardSurface) {
          removeColorClasses(cardSurface);
          cardSurface.style.backgroundColor = cardColor;
        }
        cardTitleEl.textContent = card.question;
      }
      cardContentEl.textContent = "";
    });
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        cardEl.remove();
      });
    }

    return cardEl;
  }

  deckViewCardsContainer.textContent = "";
  deck.cards.forEach((card) => {
    const flashCard = createCardEl(card);
    deckViewCardsContainer.append(flashCard);
  });
}

export { renderDeckView };
