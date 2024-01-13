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
    (returnString, element, index, myArray) =>
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
    let markers = keys.filter((key) =>
      this.squares[key].getMarker() === player.getMarker()
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
  chooseMove(emptySquareIds) {
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
  chooseMove(emptySquareIds) {
    return emptySquareIds[Math.floor(Math.random() * emptySquareIds.length)];
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
  isWinner(player) {
    return TttGame.POSSIBLE_WINNING_ROWS.some((row) =>
      this.board.countMarkersFor(player, row) === 3
    );
  }
  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }
  play() {
    console.clear();
    this.displayWelcomeMessage();
    this.board.display();

    while (true) {
      this
        .board
        .markSquareAt(
          this.human.chooseMove(this.board.getEmptySquareIds()),
          this.human.getMarker(),
        );
      if (this.gameOver()) break;

      this
        .board
        .markSquareAt(
          this.computer.chooseMove(this.board.getEmptySquareIds()),
          this.computer.getMarker(),
        );
      if (this.gameOver()) break;
      this.board.displayWithClear();
    }
    this.board.displayWithClear();
    this.displayResults();
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
