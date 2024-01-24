// Board
// Square
// Marker
// Player
//  User
//  Computer
// TttGame

const readline = require("readline-sync");

Array.prototype.joinOr = function (
  joinCharacter = ", ",
  finalJoiner = "or",
  useOxfordComma = true,
) {
  if (this.length === 0) return "";
  if (this.length === 1) return this[0].toString();
  if (this.length === 2) {
    return `${this[0].toString()} ${finalJoiner} ${this[1].toString()}`;
  }
  return this.reduce(
    (returnString, element, index) =>
      returnString + element.toString() +
      ((index <= this.length - 3)
        ? joinCharacter
        : (index === this.length - 2)
          ? (useOxfordComma ? joinCharacter : " ") + finalJoiner + " "
          : ""),
    "",
  );
};

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";
  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }
  setMarker(mark) {
    if (this.isEmpty()) {
      this.marker = mark;
      return true;
    } else {
      return false;
    }
  }
  getMarker() {
    return this.marker;
  }
  isEmpty() {
    return this.marker === Square.UNUSED_SQUARE;
  }
  toString() {
    return this.marker;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[counter] = new Square();
    }
  }
  isFull() {
    return this.getEmptySquareIds().length === 0;
  }
  getEmptySquareIds() {
    return Object
      .keys(this.squares)
      .filter((key) => this.squares[key].isEmpty());
  }
  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }
  countMarkersFor(player, keys) {
    let markerInQuestion;
    if (player instanceof Player) {
      markerInQuestion = player.getMarker();
    } else {
      markerInQuestion = player;
    }
    let markers = keys.filter((key) =>
      this.squares[key].getMarker() === markerInQuestion
    );
    return markers.length;
  }
  display() {
    console.log("");
    console.log(
      ` ${this.squares[1]} │ ${this.squares[2]} │ ${this.squares[3]}`,
    );
    console.log("───┼───┼───");
    console.log(
      ` ${this.squares[4]} │ ${this.squares[5]} │ ${this.squares[6]}`,
    );
    console.log("───┼───┼───");
    console.log(
      ` ${this.squares[7]} │ ${this.squares[8]} │ ${this.squares[9]}`,
    );
    console.log("");
  }
  displayWithClear() {
    console.clear();
    console.log("");
    this.display();
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }
  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
  chooseMove(board) {
    const emptySquareIds = board.getEmptySquareIds();
    let choice;
    while (true) {
      choice = readline.question(
        `Choose a square (${emptySquareIds.joinOr()}): `,
      );
      if (emptySquareIds.includes(choice)) {
        return choice;
      }
      console.log("Sorry, that's not a valid choice.\n");
    }
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
  #chooseBestSquareFor(playerMark, board) {
    const emptySquareIds = board.getEmptySquareIds();
    for (let i = 0; i < emptySquareIds.length; i += 1) {
      for (let j = 0; j < TttGame.POSSIBLE_WINNING_ROWS.length; j += 1) {
        if (
          TttGame.POSSIBLE_WINNING_ROWS[j].includes(emptySquareIds[i]) &&
          board.countMarkersFor(
            playerMark,
            TttGame.POSSIBLE_WINNING_ROWS[j],
          ) === 2
        ) return emptySquareIds[i];
      }
    }
    return null;
  }
  /**
   * @param {Board} board
   */
  chooseMove(board) {
    return this.#chooseBestSquareFor(Square.COMPUTER_MARKER, board) ||
      this.#chooseBestSquareFor(Square.HUMAN_MARKER, board) ||
      ((board.getEmptySquareIds().includes("5")) ? "5" : null) ||
      board
        .getEmptySquareIds()[
          Math.floor(Math.random() * board.getEmptySquareIds().length)
        ];
  }
}

class TttGame {
  static POSSIBLE_WINNING_ROWS = [
    "123",
    "456",
    "789",
    "147",
    "258",
    "369",
    "159",
    "357",
  ].map((keys) => keys.split(""));
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }
  resetBoard() {
    this.board = new Board();
  }
  isWinner(player) {
    return TttGame.POSSIBLE_WINNING_ROWS.some((row) =>
      this.board.countMarkersFor(player, row) === 3
    );
  }
  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }
  playOneRound() {
    while (true) {
      this
        .board
        .markSquareAt(
          this.human.chooseMove(this.board),
          this.human.getMarker(),
        );
      if (this.gameOver()) break;

      this
        .board
        .markSquareAt(
          this.computer.chooseMove(this.board, this.human),
          this.computer.getMarker(),
        );
      if (this.gameOver()) break;
      this.board.displayWithClear();
    }
    this.board.displayWithClear();
    this.displayResults();
  }
  play() {
    console.clear();
    this.displayWelcomeMessage();
    this.board.display();
    while (true) {
      this.playOneRound();
      if (!readline.keyInYNStrict("Play again? (y/n)?")) break;
      this.resetBoard();
      this.board.displayWithClear();
    }
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.log("Welcome to Object-Oriented Tic-Tac-Toe");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing. Goodbye.");
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! That is to be expected.");
    } else if (this.isWinner(this.computer)) {
      console.log(
        "The computer won, playing randomly. Hang your head in shame, human.",
      );
    } else {
      console.log(
        "It's a tie. Bad luck considering the computer was playing randomly.",
      );
    }
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }
}

const game = new TttGame();
game.play();
