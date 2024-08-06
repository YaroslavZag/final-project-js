// Імпорт необхідних модулів та даних
import {
  twelveCards,
  eighteenCards,
  twentyFourCards,
} from "../utils/colorsForCards.js";
import SectionForCards from "./SectionForCards.js";
import PopupWithSubmitButton from "./PopupWithSubmitButton.js";
import Popup from "./Popup.js";
import Card from "./Card.js";
import TimeButton from "./TimeButton.js";

// СТВОРЕННЯ ЕКЗЕМПЛЯРІВ КЛАСІВ

// Створення екземпляра SectionForCards з 18 картками
const cardList = new SectionForCards(createCard, ".cards");
let selectedCardsCount;
// cardList.renderItems(twentyFourCards); // Заміна з twelveCards на eighteenCards
document.querySelectorAll(".cards-screen__button").forEach((button) => {
  button.addEventListener("click", () => {
    const cardsCount = button.getAttribute("data-cards");
    console.log(cardsCount);
    console.log(typeof cardsCount);
    selectedCardsCount = cardsCount;
    const containerCard = document.querySelector(".cards");
    const totalNumberOfCards = document.getElementById("total-number-of-cards");
    totalNumberOfCards.textContent = `${cardsCount}`;
    switch (cardsCount) {
      case "12":
        cardList.renderItems(twelveCards);
        containerCard.classList.add("grid-template-4-cols");
        break;
      case "18":
        cardList.renderItems(eighteenCards);
        containerCard.classList.add("grid-template-6-cols");
        break;
      case "24":
        cardList.renderItems(twentyFourCards);
        containerCard.classList.add("grid-template-8-cols");
        break;
      default:
        cardList.renderItems(twelveCards);
    }
  });
});

// Створення екземплярів попапів
const popupGameVictory = new PopupWithSubmitButton(
  ".popup_type_game-victory",
  handleStartGameButton
);
popupGameVictory.setEventListeners();

const popupGameRules = new Popup(".popup_type_game-rules");
popupGameRules.setEventListeners();

const popupGameLoose = new PopupWithSubmitButton(
  ".popup_type_game-loose",
  handleStartGameButton
);
popupGameLoose.setEventListeners();

// Створення екземплярів timeButton
const timeButton30sec = new TimeButton(
  "time-screen__button_30s",
  handleTimeButtonClick
);
timeButton30sec.setEventListeners();

const timeButton45sec = new TimeButton(
  "time-screen__button_45s",
  handleTimeButtonClick
);
timeButton45sec.setEventListeners();

const timeButton60sec = new TimeButton(
  "time-screen__button_60s",
  handleTimeButtonClick
);
timeButton60sec.setEventListeners();

// ЗМІННІ
const cards = document.querySelectorAll(".card");

const linkForGameRules = document.querySelector(
  ".footer__link_type_game-rules"
);
const linkForStartGame = document.querySelector(".footer__link_type_new-game");

const timer = document.getElementById("timer");

let timerId = undefined;
let timeForGame;
let firstCard;
let secondCard;
let numberOfFoundMatches = 0;
let numberOfDisabledCards = 0;
const counterOfDisabledCards = document.getElementById(
  "counter-of-disabled-cards"
);
const totalNumberOfCards = document.getElementById("total-number-of-cards");

totalNumberOfCards.textContent = `${cards.length}`;

const debug = false; // константа для налагодження

//ФУНКЦІЇ

// Створення картки
function createCard(color) {
  const card = new Card(".template", color, checkCard);

  const cardElement = card.createCard();

  cardList.addItem(cardElement);
}

function startNewGame(colors) {
  deleteCards();
  setCounterToZero();
  cardList.renderItems(colors);
  popupGameVictory.closePopup(); // todo потрібно рефакторити, або передавати як аргумент, або змінювати
}

function handleStartGameButton() {
  startNewGame(0);
}

// Функції, пов'язані з функціоналом гри
function isAllCardsOpened() {
  if (numberOfFoundMatches === selectedCardsCount / 2) {
    popupGameVictory.openPopup();
    clearInterval(timerId);
  }
}

function checkCard() {
  updateCounter();
  if (!firstCard) {
    firstCard = this;
    flipCard(firstCard);
    if (debug) {
      console.log("перша карта");
    }
  } else if (firstCard && !(this === firstCard)) {
    secondCard = this;
    flipCard(secondCard);
    checkIfCardsAreMatched();
    if (debug) {
      console.log("друга карта");
    }
  } else if (this === firstCard) {
    if (debug) {
      console.log("ви вже відкрили цю картку, ми її закриваємо");
    }
    firstCard = null;
    unFlipCard(this);
  }
}

function flipCard(card) {
  const front = card.querySelector(".card-front");
  const back = card.querySelector(".card-back");

  front.classList.add("card-front-animation");
  back.classList.add("card-back-animation");
}

function unFlipCardWithTimeout(card) {
  setTimeout(unFlipCard, 1000, card);
}

function unFlipCard(card) {
  const front = card.querySelector(".card-front");
  const back = card.querySelector(".card-back");
  front.classList.remove("card-front-animation");
  back.classList.remove("card-back-animation");
}

function makeCardsDisabled(firstCard, secondCard) {
  firstCard.removeEventListener("click", checkCard);
  secondCard.removeEventListener("click", checkCard);
  if (debug) {
    console.log("блокуємо картки");
  }
  numberOfDisabledCards = numberOfDisabledCards + 2;

  firstCard.setAttribute("data-isDisabled", "true");
  secondCard.setAttribute("data-isDisabled", "true");
}

function showAnimationForDisabledCards() {
  if (debug) {
    console.log("Ця картка заблокована, виберіть іншу картку");
  }
  // todo додати анімацію для заблокованих карток
}

function updateCounter() {
  counterOfDisabledCards.innerText = `${numberOfDisabledCards}`;
}

function setCounterToZero() {
  numberOfFoundMatches = 0;
  numberOfDisabledCards = 0;
  updateCounter();
}

function checkIfCardsAreMatched() {
  if (firstCard.id === secondCard.id) {
    if (debug) {
      console.log("картки однакові");
    }
    makeCardsDisabled(firstCard, secondCard);
    firstCard.addEventListener("click", showAnimationForDisabledCards);
    secondCard.addEventListener("click", showAnimationForDisabledCards);
    numberOfFoundMatches = numberOfFoundMatches + 1;
    console.log(numberOfFoundMatches);
    updateCounter();
    setTimeout(isAllCardsOpened, 1000);
  } else {
    if (debug) {
      console.log("картки різні");
    }
    unFlipCardWithTimeout(firstCard);
    unFlipCardWithTimeout(secondCard);
  }
  firstCard = null;
  secondCard = null;
}

function deleteCards() {
  Array.from(document.querySelectorAll(".card")).forEach((card) => {
    card.remove();
    card.removeAttribute("data-isDisabled");
  });
}

function decreaseTime() {
  if (timeForGame === 0) {
    popupGameLoose.openPopup();
    console.log("відкриваємо попап про програш");
    document.querySelectorAll(".card").forEach((card) => {
      card.removeEventListener("click", checkCard);
      console.log("блокуємо картки");
    });
    timeForGame = -1;
    console.log("зменшили timeForGame", timeForGame);
  } else if (timeForGame > 0) {
    let current = --timeForGame;
    if (current < 10) {
      current = `0${current}`;
    }
    setTime(current);
  }
}

function setTime(value) {
  timer.innerHTML = `00:${value}`;
}

// ВСТАНОВЛЕННЯ СЛУХАЧІВ ПОДІЙ

linkForGameRules.addEventListener("click", () => {
  popupGameRules.openPopup();
});

linkForStartGame.addEventListener("click", () => {
  setTimeout(startNewGame, 500, eighteenCards);
});

function handleTimeButtonClick() {
  timeForGame = parseInt(this.dataset.time);
  console.log(this.dataset.time);
  if (!(timerId === undefined)) {
    clearInterval(timerId);
  }
  timerId = setInterval(decreaseTime, 1000);
}
