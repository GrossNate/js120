// Board
// Square
// Marker
// Player
//  User
//  Computer
// TttGame

const readline = require("readline-sync");

const Square = {
  UNUSED_SQUARE: " ",
  HUMAN_MARKER: "X",
  COMPUTER_MARKER: "O",
  init(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
    return this;
  },
  setMarker(mark) {
    if (this.isEmpty()) {
      this.marker = mark;
      return true;
    } else {
      return false;
    }
  },
  getMarker() {
    return this.marker;
  },
  isEmpty() {
    return this.marker === Square.UNUSED_SQUARE;
  },
  toString() {
    return this.marker;
  },
};

const Board = {
  init() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[counter] = Object.create(Square).init();
    }
    return this;
  },
  isFull() {
    return this.getEmptySquareIds().length === 0;
  },
  getEmptySquareIds() {
    return Object
      .keys(this.squares)
      .filter((key) => this.squares[key].isEmpty());
  },
  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  },
  countMarkersFor(player, keys) {
    let markers = keys.filter((key) =>
      this.squares[key].getMarker() === player.getMarker()
    );
    return markers.length;
  },
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
  },
  displayWithClear() {
    console.clear();
    console.log("");
    this.display();
  },
};

const Player = {
  initialize(marker) {
    this.marker = marker;
    return this;
  },
  getMarker() {
    return this.marker;
  },
};

const Human = Object.create(Player);

Object.assign(Human, {
  init() {
    return this.initialize(Square.HUMAN_MARKER);
  },
  chooseMove(emptySquareIds) {
    let choice;
    while (true) {
      choice = readline.question(
        `Choose a square (${emptySquareIds.join(", ")}): `,
      );
      if (emptySquareIds.includes(choice)) {
        return choice;
      }
      console.log("Sorry, that's not a valid choice.\n");
    }
  },
});

const Computer = Object.create(Player);

Object.assign(Computer, {
  init() {
    return this.initialize(Square.COMPUTER_MARKER);
  },
  chooseMove(emptySquareIds) {
    return emptySquareIds[Math.floor(Math.random() * emptySquareIds.length)];
  },
});

const TttGame = {
  POSSIBLE_WINNING_ROWS: [
    "123",
    "456",
    "789",
    "147",
    "258",
    "369",
    "159",
    "357",
  ].map((keys) => keys.split("")),
  init() {
    this.board = Object.create(Board).init();
    this.human = Object.create(Human).init();
    this.computer = Object.create(Computer).init();
    return this;
  },
  isWinner(player) {
    return TttGame.POSSIBLE_WINNING_ROWS.some((row) =>
      this.board.countMarkersFor(player, row) === 3
    );
  },
  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  },
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
  },
  displayWelcomeMessage() {
    console.log("Welcome to Object-Oriented Tic-Tac-Toe");
  },
  displayGoodbyeMessage() {
    console.log("Thanks for playing. Goodbye.");
  },
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
  },
  gameOver() {
    return this.board.isFull() || this.someoneWon();
  },
};

const game = Object.create(TttGame).init();
game.play();
