"use strict";

class Config {
  static TARGET = 21;
  static DEALER_STAY_LIMIT = 17;
  static NUMBER_OF_DECKS = 8;
  static STARTING_PURSE_VALUE = 5;
  static RICH_VALUE = 10;
  static BROKE_VALUE = 0;
}

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
  /**
   * @param {Card} card
   * @returns {number[]}
   */
  static getValues(card) {
    return Card.VALUES[card.getRank()];
  }

  #rank;
  #suit;
  #isFaceDown;

  constructor(rank, suit, isFaceDown = true) {
    this.#rank = rank;
    this.#suit = suit;
    this.#isFaceDown = isFaceDown;
  }

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
  static shuffle(cards, numOfShuffles = 1) {
    // This method can take either a Deck or Array<Card>, so we need to handle
    // that by check if the argument is a Deck, and if so, reassigning it to the
    // deck's array of Card objects.
    if (cards instanceof Deck) cards = cards.#cards;
    for (
      let shuffleCount = 1;
      shuffleCount <= numOfShuffles;
      shuffleCount += 1
    ) {
      for (let index = cards.length - 1; index > 0; index -= 1) {
        let otherIndex = Math.floor(Math.random() * (index + 1));
        [cards[index], cards[otherIndex]] = [
          cards[otherIndex],
          cards[index],
        ];
      }
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
      this.#cards.push(...cards);
    }
    if (preShuffle) {
      // Shuffling the combined deck 7 times to be thorough.
      Deck.shuffle(this.#cards, 7);
    }
  }

  getCard(takeFaceDown = true) {
    const returnCard = this.#cards.pop().turnFaceDown();
    if (!takeFaceDown) returnCard.turnFaceUp();
    return returnCard;
  }

  addCard(card) {
    this.#cards.push(card);
  }
}

class Hand {
  #cards;

  constructor() {
    this.#cards = [];
  }

  addCard(card) {
    this.#cards.push(card);
  }

  removeCard() {
    if (this.#cards.length < 1) return null;
    return this.#cards.pop();
  }

  getCardCount() {
    return this.#cards.length;
  }

  getScore() {
    function sumValues(sum, cardArr) {
      if (cardArr.length === 0) {
        return (sum <= Config.TARGET) ? sum : 0;
      } else {
        return Math.max(
          ...(Card.getValues(cardArr[0]).map((value) =>
            sumValues(value + sum, cardArr.slice(1))
          )),
        );
      }
    }
    return (sumValues(0, this.#cards) === 0)
      ? Config.TARGET + 1
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
  #purse;

  constructor() {
    super();
    this.#purse = Config.STARTING_PURSE_VALUE;
  }

  addToPurse(amount = 1) {
    this.#purse += amount;
  }

  subtractFromPurse(amount = 1) {
    this.#purse -= amount;
  }

  getPurseBalance() {
    return this.#purse;
  }

  isBroke() {
    return this.getPurseBalance() <= Config.BROKE_VALUE;
  }

  isRich() {
    return this.getPurseBalance() >= Config.RICH_VALUE;
  }
  solicitHit() {
    return Display.readline.keyInYNStrict("Do you want to hit?");
  }
}

class TwentyOneGame {
  #dealer;
  #user;
  #deck;

  constructor() {
    this.#dealer = new Player();
    this.#user = new HumanPlayer();
    this.#deck = new Deck(Config.NUMBER_OF_DECKS);
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    while (true) {
      this.playOneRound();
      if ((this.#user.isBroke() || this.#user.isRich())) break;
      if (!Display.readline.keyInYNStrict("Keep playing?")) {
        console.clear();
        break;
      }
      this.resetGame();
    }
    this.displayGoodbyeMessage();
  }

  playOneRound() {
    this.dealCards();
    this.showCards();
    if (this.isDealerHandNaturalBlackjack()) {
      this.displayNaturalBlackjackMessage();
    } else {
      this.playerTurn();
      this.dealerTurn();
    }
    this.dealerRevealCards();
    this.distributeWinnings();
    this.displayResult();
  }

  distributeWinnings() {
    if (this.determineWinner() === "user") {
      this.#user.addToPurse(1);
    } else if (this.determineWinner() === "dealer") {
      this.#user.subtractFromPurse(1);
    }
  }

  resetGame() {
    console.clear();
    while (this.#user.getHand().getCardCount() > 0) {
      this.#deck.addCard(this.#user.getHand().removeCard());
    }
    while (this.#dealer.getHand().getCardCount() > 0) {
      this.#deck.addCard(this.#dealer.getHand().removeCard());
    }
    Deck.shuffle(this.#deck, 7);
  }

  isDealerHandNaturalBlackjack() {
    return this.#dealer.getHand().getScore() === Config.TARGET;
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

  hit(player) {
    player.getHand().addCard(this.#deck.getCard(false));
  }

  showCards() {
    console.log(`dealer: ${this.#dealer.getHand().getDisplayString()}`);
    console.log(`user: ${this.#user.getHand().getDisplayString()}`);
    console.log();
  }

  playerTurn() {
    while (this.#user.getHand().getScore() <= Config.TARGET) {
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
    if (this.#user.getHand().getScore() > Config.TARGET) return;
    while (
      this.#dealer.getHand().getScore() < Config.DEALER_STAY_LIMIT
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
        `${Config.TARGET} without going over wins. Each player plays ` +
        "against the dealer. If the dealer gets a natural blackjack " +
        `(${Config.TARGET} on the deal) then the game is over ` +
        "immediately and no players have a chance to take any cards. If you " +
        "need more help than that then Google is your friend or you could " +
        "just play a round or two. Have fun!\n",
      80,
    ));
    Display.readline.keyInPause("Press any key to play!");
    console.clear();
  }

  displayGoodbyeMessage() {
    console.log(
      `You finished the game with $${this.#user.getPurseBalance()} in your purse.`,
    );
    if (this.#user.getPurseBalance() >= Config.RICH_VALUE) {
      console.log("Congrats, you're rich!");
    } else if (this.#user.getPurseBalance() <= Config.BROKE_VALUE) {
      console.log("Sorry, you're broke.");
    }
    console.log("Thank you for playing. Goodbye.");
  }

  determineWinner() {
    let dealerScore = this.#dealer.getHand().getScore();
    let userScore = this.#user.getHand().getScore();
    if (dealerScore > Config.TARGET) dealerScore = 0;
    if (userScore > Config.TARGET) userScore = 0;
    if (dealerScore > userScore) {
      return "dealer";
    } else if (userScore > dealerScore) {
      return "user";
    } else {
      return "tie";
    }
  }

  displayResult() {
    console.clear();
    this.showCards();
    let resultMessage;
    let dealerScore = this.#dealer.getHand().getScore();
    let userScore = this.#user.getHand().getScore();
    if (dealerScore > Config.TARGET) dealerScore = 0;
    if (userScore > Config.TARGET) userScore = 0;
    const winner = this.determineWinner();
    if (winner === "dealer") {
      resultMessage = "Dealer wins.";
    } else if (winner === "user") {
      resultMessage = "User wins.";
    } else {
      resultMessage = "It's a tie!";
    }
    console.log(resultMessage);
    console.log(`User has $${this.#user.getPurseBalance()} in their purse.`);
    console.log();
  }
}

let game = new TwentyOneGame();
game.start();
