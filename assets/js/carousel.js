import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colors.js";

function renderCarouselDeckView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;

  const carouselEl = document.querySelector("#carousel");
  // CAROUSEL CARD ELEMENT
  const carouselCardEl = carouselEl.querySelector(".carousel__card");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  const carouselCardContent = carouselCardEl.querySelector(
    ".carousel__card-content",
  );
  const deckContentEl = carouselCardContent.querySelector(
    ".carousel__card-text",
  );
  const deckTitleEl = carouselEl.querySelector(".carousel__title");

  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    // Then update the arrow handlers to refer to the cards array, not images.
    if (currentIndex === deck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  function updateDisplay() {
    // After that, set the text content of the card text element.
    // Use the question property of the current card.
    deckTitleEl.textContent = `${deck.name} • ${currentIndex + 1} of ${deck.cards.length}`;
    if (showingQuestion) {
      deckContentEl.textContent = deck.cards[currentIndex].question;
      // Use removeColorClasses() to remove any color modifiers that are currently on the element.
      // This will ensure a clean slate each time we render the carousel.
      removeColorClasses(carouselCardContent);

      // Set the element’s color, using the hexToString() function
      // to get the color’s name (as you did for the deck element).
      const deckColorHex = deck.color;
      const deckColorName = hexToString(deckColorHex);
      // Create modifiers in the CSS of the form card__carouselcolor.
      // You can copy and paste the deckcolor modifiers and adjust it.
      const deckCssColorName = `card__carousel_color_${deckColorName}`;
      carouselCardContent.classList.add(deckCssColorName);
    } else {
      deckContentEl.textContent = deck.cards[currentIndex].answer;
      removeColorClasses(carouselCardContent);
      carouselCardContent.classList.add(`card__carousel_color_white`);
    }
    updateArrows();
  }

  // Now, let’s get the arrow buttons to switch the cards.
  // You’ll need to update the left/right button event handlers and updateDisplay().
  rightBtn.addEventListener("click", () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true; // Reset to showing question when navigating forward
      updateDisplay();
    }
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true; // Reset to showing question when navigating back
      updateDisplay();
    }
  });

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  updateDisplay();
}

export { renderCarouselDeckView };
