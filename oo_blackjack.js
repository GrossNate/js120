"use strict";

class Display {
  static readline = require("readline-sync");
  static wrapText(text, maxWidth) {
    if (text.length <= maxWidth) return text;
    let lastSpaceIndex = 0;
    let charIndex = 0;
    while (charIndex < maxWidth) {
      if (text[charIndex].match(/\s/)) lastSpaceIndex = charIndex;
      charIndex += 1;
    }
    return text.slice(0, lastSpaceIndex) + "\n" +
      Display.wrapText(text.slice(lastSpaceIndex + 1), maxWidth);
  }
}

class Card {
  static SUITS = {
    HEART: "♥️",
    CLUB: "♣️",
    SPADE: "♠️",
    DIAMOND: "♦️",
  };
  static VALUES = {
    A: [1, 11],
    2: [2],
    3: [3],
    4: [4],
    5: [5],
    6: [6],
    7: [7],
    8: [8],
    9: [9],
    10: [10],
    J: [10],
    Q: [10],
    K: [10],
  };
  // The following is roughly approximating an enum, which doesn't exist in
  // JavaScript.
  static RANKS = {
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    J: "J",
    Q: "Q",
    K: "K",
    A: "A",
  };

  #rank;
  #suit;
  #isFaceDown;

  constructor(rank, suit, isFaceDown = true) {
    this.#rank = rank;
    this.#suit = suit;
    this.#isFaceDown = isFaceDown;
  }
  /**
   * @param {Card} card
   * @returns {number[]}
   */
  static getValues(card) {
    return Card.VALUES[card.getRank()];
  }

  /**
   * @returns {string}
   */
  getRank() {
    return this.#rank;
  }
  isFaceDown() {
    return this.#isFaceDown;
  }
  isFaceUp() {
    return !this.#isFaceDown;
  }
  turnFaceUp() {
    this.#isFaceDown = false;
    return this;
  }
  turnFaceDown() {
    this.#isFaceDown = true;
    return this;
  }
  getDisplayString() {
    return (this.#isFaceDown)
      ? "[    ]"
      : `[${this.#rank.padStart(2, " ")}${this.#suit} ]`;
  }
}

class Deck {
  static shuffle(cards) {
    if (cards instanceof Deck) cards = cards.#cards;
    // need to check if cards are a deck or not
    for (let index = cards.length - 1; index > 0; index -= 1) {
      let otherIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[otherIndex]] = [
        cards[otherIndex],
        cards[index],
      ];
    }
  }
  #cards;
  /**
   * Create a deck.
   * @param {number} numberOfDecks - The number of "sub decks" that make up the
   *     deck. I.e. if you're playing with 2 decks (104 cards) then this would
   *     be 2.
   * @param {boolean} preShuffle - Whether or not to shuffle the cards.
   */
  constructor(numberOfDecks = 1, preShuffle = true) {
    this.#cards = [];
    for (let i = 1; i <= numberOfDecks; i += 1) {
      const cards = [];
      for (let rank in Card.RANKS) {
        Object.keys(Card.SUITS).forEach((suitKey) =>
          cards.push(new Card(rank, Card.SUITS[suitKey]))
        );
      }
      if (preShuffle) Deck.shuffle(cards); // Shuffling each deck as we add it.
      this.#cards.push(...cards);
    }
    if (preShuffle) {
      // Shuffling the deck 7 times.
      Array(7).fill(null).forEach((_) => Deck.shuffle(this.#cards));
    }
  }
  getCard(takeFaceDown = true) {
    const returnCard = this.#cards.pop().turnFaceDown();
    if (!takeFaceDown) returnCard.turnFaceUp();
    return returnCard;
  }
}

class Hand {
  #cards;
  constructor() {
    /** Array<Card> */
    this.#cards = [];
  }
  addCard(card) {
    this.#cards.push(card);
  }
  removeCard() {
    if (this.#cards.length < 1) return null;
    return this.#cards.pop();
  }
  getScore() {
    function sumValues(sum, cardArr) {
      if (cardArr.length === 0) {
        return (sum <= TwentyOneGame.TARGET) ? sum : 0;
      } else {
        return Math.max(
          ...(Card.getValues(cardArr[0]).map((value) =>
            sumValues(value + sum, cardArr.slice(1))
          )),
        );
      }
    }

    return (sumValues(0, this.#cards) === 0)
      ? TwentyOneGame.TARGET + 1
      : sumValues(0, this.#cards);
  }
  revealCards() {
    this.#cards.forEach((card) => card.turnFaceUp());
  }
  getDisplayString() {
    return this.#cards.map((card) => card.getDisplayString()).join(" ");
  }
}
class Player {
  #hand;
  constructor() {
    this.#hand = new Hand();
  }
  getHand() {
    return this.#hand;
  }
}

class HumanPlayer extends Player {
  constructor() {
    super();
  }

  solicitHit() {
    return Display.readline.keyInYNStrict("Do you want to hit?");
  }
}

class TwentyOneGame {
  static TARGET = 21;
  static DEALER_STAY_LIMIT = 17;
  #dealer;
  #user;
  #deck;
  constructor() {
    this.#dealer = new Player();
    this.#user = new HumanPlayer();
    this.#deck = new Deck(8); // We're playing with a 8 decks combined.
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    this.dealCards();
    this.showCards();
    if (this.isDealerHandNaturalBlackjack()) {
      this.displayNaturalBlackjackMessage();
    } else {
      this.playerTurn();
      this.dealerTurn();
    }
    this.dealerRevealCards();
    this.displayResult();
    this.displayGoodbyeMessage();
  }

  isDealerHandNaturalBlackjack() {
    return this.#dealer.getHand().getScore() === TwentyOneGame.TARGET;
  }

  displayNaturalBlackjackMessage() {
    console.log("Dealer has a natural blackjack!");
    Display.readline.keyInPause("Press any key to continue.");
  }
  dealerRevealCards() {
    this.#dealer.getHand().revealCards();
  }

  dealCards() {
    Array(2).fill(null).forEach((_, index) => {
      this.#dealer.getHand().addCard(
        this.#deck.getCard(index === 0),
      );
      this.#user.getHand().addCard(this.#deck.getCard(false));
    });
  }
  /** @param {Player} player */
  hit(player) {
    player.getHand().addCard(this.#deck.getCard(false));
  }
  showCards() {
    //STUB
    console.log(`dealer: ${this.#dealer.getHand().getDisplayString()}`);
    console.log(`user: ${this.#user.getHand().getDisplayString()}`);
    console.log();
  }

  playerTurn() {
    while (this.#user.getHand().getScore() <= TwentyOneGame.TARGET) {
      if (this.#user.solicitHit()) {
        this.hit(this.#user);
      } else {
        break;
      }
      console.clear();
      this.showCards();
    }
  }

  dealerTurn() {
    while (
      this.#dealer.getHand().getScore() < TwentyOneGame.DEALER_STAY_LIMIT
    ) {
      this.hit(this.#dealer);
    }
  }

  displayWelcomeMessage() {
    console.log(
      "Let's play . . . \n\n" +
        " _     _            _    _            _    \n" +
        "| |   | |          | |  (_)          | |   \n" +
        "| |__ | | __ _  ___| | ___  __ _  ___| | __\n" +
        "| '_ \\| |/ _` |/ __| |/ / |/ _` |/ __| |/ /\n" +
        "| |_) | | (_| | (__|   <| | (_| | (__|   < \n" +
        "|_.__/|_|\\__,_|\\___|_|\\_\\ |\\__,_|\\___|_|\\_\\\n" +
        "                       _/ |                \n" +
        "                      |__/\n\n",
    );
    console.log(Display.wrapText(
      "This is the most basic version of the casino-style game. Closest to " +
        `${TwentyOneGame.TARGET} without going over wins. Each player plays ` +
        "against the dealer. If the dealer gets a natural blackjack " +
        `(${TwentyOneGame.TARGET} on the deal) then the game is over ` +
        "immediately and no players have a chance to take any cards. If you " +
        "need more help than that then Google is your friend or you could " +
        "just play a round or two. Have fun!\n",
      80,
    ));
    Display.readline.keyInPause("Press any key to play!");
    console.clear();
  }

  displayGoodbyeMessage() {
    console.log("Thank you for playing. Goodbye.");
  }

  displayResult() {
    console.clear();
    this.showCards();
    let resultMessage;
    let dealerScore = this.#dealer.getHand().getScore();
    let userScore = this.#user.getHand().getScore();
    if (dealerScore > TwentyOneGame.TARGET) dealerScore = 0;
    if (userScore > TwentyOneGame.TARGET) userScore = 0;
    if (dealerScore > userScore) {
      resultMessage = "Dealer wins.";
    } else if (userScore > dealerScore) {
      resultMessage = "User wins.";
    } else {
      resultMessage = "It's a tie!";
    }
    console.log(resultMessage);
  }
}

let game = new TwentyOneGame();
game.start();
