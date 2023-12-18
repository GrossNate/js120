const readline = require("readline-sync");

function createIo() {
  return {
    /**
     * Takes an array of words and returns a map with the words as keys and then
     * the number of characters at the start of each word needed to assure that
     * they are distinct.
     * @param {string[]} choicesArray
     * @returns {Map<string, number>}
     */
    findMinDistinctChars(choicesArray) {
      let minDistinctChars = new Map();
      choicesArray.forEach((choice) => minDistinctChars.set(choice, 0));
      choicesArray.forEach((choice) => {
        choicesArray.forEach((comparisonChoice) => {
          if (choice !== comparisonChoice) {
            for (let numChars = 1; numChars <= choice.length; numChars += 1) {
              if (
                choice.slice(0, numChars) !==
                  comparisonChoice.slice(0, numChars)
              ) {
                if (numChars > minDistinctChars.get(choice)) {
                  minDistinctChars.set(choice, numChars);
                }
                break;
              }
            }
          }
        });
      });
      return minDistinctChars;
    },
    /**
     * Simply outputs to the console the message, prefixed with a prompt.
     * @param {string} message - The message to display to user.
     */
    prompt(message) {
      console.log(`=> ${message}`);
    },
    /**
     * Ask the user a question, then validate and return the response.
     * @param {string} question - The question for the user to answer.
     * @param {string[]} possibleChoices - An array of the valid choices.
     * @returns {string}
     */
    getUserInput(question, possibleChoices) {
      this.prompt(question);
      let response = readline.question().toLowerCase();
      while (!possibleChoices.includes(response)) {
        this.prompt(`Invalid response, try again. ${question}`);
        response = readline.question().toLowerCase();
      }
      return response;
    },
    displayWelcomeMessage() {
      console.log("Welcome to Rock, Paper, Scissors!");
    },
    displayGoodbyeMessage() {
      console.log("Thanks for playing Rock, Paper, Scissors");
    },
    displayWinner(matchWinner) {
      console.log(`Overall winner is ${matchWinner}!`);
    },
    displayMoveHistory(moveHistory, gameRules) {
      console.log(this.tablefy(
        [
          moveHistory.humanMoves.map((_, i) => `Round ${i + 1}`),
          moveHistory.humanMoves,
          moveHistory.computerMoves,
          moveHistory.humanMoves.map((_, i) =>
            gameRules.determineWinner(
              moveHistory.humanMoves[i],
              moveHistory.computerMoves[i],
            )
          ),
        ],
        "Move History",
        ["", "Human", "Computer", "Winner"],
        (rowIndex) => `Round ${rowIndex + 1}`,
      ));
    },

    displayScore(score) {
      console.log(
        `The score is human: ${score.human}, computer: ${score.computer}.`,
      );
    },

    getInputChoices(rulesObject) {
      let inputChoices = new Map();
      // rulesObject.choices.forEach((_, key) => inputChoices.set(key, key));
      this.findMinDistinctChars(
        Array.from(rulesObject.choices.keys()).slice(0, rulesObject.numChoices),
      )
        .forEach((value, key) => inputChoices.set(key.slice(0, value), key));
      return inputChoices;
    },
    getFormattedChoices(rulesObject) {
      let formattedChoices = [];
      this.getInputChoices(rulesObject).forEach((value, key) =>
        formattedChoices.push(`${value} (${key})`)
      );
      return formattedChoices.join(", ");
    },

    /**
     * @param {Array[]} columnsArray
     * @param {string} title
     * @param {string[]} columnHeaders
     * @returns {string}
     */
    tablefy(columnsArray, title, columnHeaders) {
      let columnWidths = columnsArray.map((column) =>
        this.getMaxElementWidth(column)
      );
      columnWidths = columnWidths.map((width, index) =>
        Math.max(width, columnHeaders[index].toString().length)
      );
      let returnString = "";
      returnString += this.generateSeparatorRow("┌", "─", "┐", columnWidths) +
        "\n";
      returnString += "│" + this.center(
        title,
        columnWidths.reduce((sum, width) => sum + width + 1),
      ) + "│\n";
      returnString += this.generateSeparatorRow("├", "┬", "┤", columnWidths) +
        "\n";
      returnString += this.generateRow(columnHeaders, columnWidths) + "\n";
      returnString += this.generateSeparatorRow("├", "┼", "┤", columnWidths) +
        "\n";
      for (let i = 0; i < columnsArray[0].length; i += 1) {
        returnString += this.generateRow(
          columnsArray.map((column) => column[i]),
          columnWidths,
        ) + "\n";
      }
      returnString += this.generateSeparatorRow("└", "┴", "┘", columnWidths);
      return returnString;
    },
    /**
     * Generates a separator row (top, middle, or bottom lines of the table).
     * @param {string} leftSeparator
     * @param {string} divider
     * @param {string} rightSeparator
     * @param {number[]} columnWidths
     */
    generateSeparatorRow(leftChar, divider, rightChar, columnWidths) {
      return leftChar +
        columnWidths.map((width) => "─".repeat(width)).join(divider) +
        rightChar;
    },

    /**
     * Generates a string with elements padded to column widths and separated by
     * vertical bars.
     * @param {string[]} rowElements
     * @param {number[]} columnWidths
     * @param {string} separator
     */
    generateRow(rowElements, columnWidths, separator = "│") {
      return separator +
        rowElements
          .map((element, index) => this.padRight(element, columnWidths[index]))
          .join(separator) +
        separator;
    },
    /**
     * Takes an array and returns the number of characters in the string
     * representations of the elements.
     * @param {Array} inputArray
     * @returns {number}
     */
    getMaxElementWidth(inputArray) {
      return Math.max(
        ...(inputArray.map((element) => element.toString().length)),
      );
    },

    /**
     * Takes a string and returns it padded to the specified width.
     * @param {string} inputString
     * @param {number} width
     * @param {string} padChar
     * @returns {string}
     */
    padRight(inputString, width, padChar = " ") {
      return inputString + padChar.repeat(width - inputString.length);
    },
    /**
     * Takes a string and returns it padded to be centered in the specified
     * width.
     * @param {string} inputString
     * @param {number} width
     * @returns {string}
     */
    center(inputString, width) {
      let leftPad = " ".repeat(Math.floor((width - inputString.length) / 2));
      let rightPad = " ".repeat(Math.ceil((width - inputString.length) / 2));
      return leftPad + inputString + rightPad;
    },
  };
}

function createGameRules() {
  let rulesObject = {
    numRounds: 3,
    numChoices: 3,
    choices: new Map(),
    /**
     * Determines who won the game. Will return an error if we didn't define who
     * wins in the CHOICES map.
     * @param {string} userChoice
     * @param {string} computerChoice
     * @returns {string} Should be one of: tie, human, computer. Will be
     * "undefined outcome" in the event a winner isn't defined in the CHOICES
     * map.
     */
    determineWinner(userChoice, computerChoice) {
      if (userChoice === computerChoice) {
        return "tie";
      } else if (
        Array.from(this.choices.get(userChoice)).includes(computerChoice)
      ) {
        return "human";
      } else if (
        Array.from(this.choices.get(computerChoice)).includes(userChoice)
      ) {
        return "computer";
      } else {
        return "undefined outcome";
      }
    },
    setNumRounds(numRounds) {
      this.numRounds = numRounds;
      return this.numRounds;
    },
    setNumChoices(numChoices) {
      if (numChoices % 2 === 0 || numChoices > this.choices.size) return null;
      this.numChoices = numChoices;
      return this.numChoices;
    },
    getChoices() {
      let returnChoices = new Map();
      let keys = Array.from(this.choices.keys());
      keys.length = this.numChoices;
      keys.forEach((key) => returnChoices.set(key, this.choices.get(key)));
      return returnChoices;
    },
  };
  rulesObject.choices.set("rock", ["scissors", "lizard"]);
  rulesObject.choices.set("paper", ["rock", "spock"]);
  rulesObject.choices.set("scissors", ["paper", "lizard"]);
  rulesObject.choices.set("lizard", ["spock", "paper"]);
  rulesObject.choices.set("spock", ["rock", "scissors"]);
  return rulesObject;
}

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    choose(moveHistory, gameRules) {
      const choices = Array.from(gameRules.getChoices().keys());
      if (moveHistory.humanMoves.length === 0) {
        let randomIndex = Math.floor(Math.random() * choices.length);
        this.move = choices[randomIndex];
        return;
      }
      const winProbabilities = choices.map((choice) =>
        moveHistory.humanMoves.reduce((wins, humanMove) => {
          if (gameRules.determineWinner(humanMove, choice) === "computer") {
            return wins + 1;
          } else if (gameRules.determineWinner(humanMove, choice) === "human") {
            return wins - 1;
          } else {
            return wins;
          }
        }, 0) / moveHistory.humanMoves.length
      );
      const highestIndex = winProbabilities.indexOf(
        Math.max(...winProbabilities),
      );
      this.move = choices[highestIndex];
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();
  let humanObject = {
    choose(io, gameRules) {
      let choice;
      choice = io.getUserInput(
        `Choose one: ${io.getFormattedChoices(gameRules)}`,
        Array.from(io.getInputChoices(gameRules).keys()),
      );
      this.move = io.getInputChoices(gameRules).get(choice);
    },
  };
  return Object.assign(playerObject, humanObject);
}

function createPlayer() {
  return {
    move: null,
  };
}

const RPSGame = {
  gameRules: createGameRules(),
  human: createHuman(),
  computer: createComputer(),
  io: createIo(),
  winner: null,
  moveHistory: {
    humanMoves: [],
    computerMoves: [],
    logMove(player, move) {
      this[player + "Moves"].push(move);
    },
    reset() {
      this.humanMoves = [];
      this.computerMoves = [];
    },
  },
  score: {
    human: 0,
    computer: 0,
    reset() {
      this.human = 0;
      this.computer = 0;
    },
  },

  incrementScore(player) {
    this.score[player] += 1;
  },

  logMoves() {
    this.moveHistory.logMove("human", this.human.move);
    this.moveHistory.logMove("computer", this.computer.move);
  },

  playAgain() {
    console.log("Would you like to play again? (y/n)");
    let answer = readline.question();
    return answer.toLowerCase()[0] === "y";
  },
  setupGame() {
    this.gameRules.setNumChoices(
      this.io.getUserInput(
        "Would you like to play with the traditional number of choices (3) or an expanded version (5)?",
        ["3", "5"],
      ),
    );
    this.gameRules.setNumRounds(
      this.io.getUserInput(
        "What score do you want to play to? (pick a number < 26)",
        Array(25).fill(1).map((_, index) => (index + 1).toString()),
      ),
    );
  },
  determineMatchWinner() {
    if (this.score.human >= this.gameRules.numRounds) {
      return "human";
    } else if (this.score.computer >= this.gameRules.numRounds) {
      return "computer";
    } else {
      return null;
    }
  },
  play() {
    console.clear();
    this.io.displayWelcomeMessage();
    this.setupGame();
    while (true) {
      this.score.reset();
      this.moveHistory.reset();
      while (!this.determineMatchWinner()) {
        console.clear();
        this.io.displayMoveHistory(this.moveHistory, this.gameRules);
        this.io.displayScore(this.score);
        this.human.choose(this.io, this.gameRules);
        this.computer.choose(this.moveHistory, this.gameRules);
        this.winner = this.gameRules.determineWinner(
          this.human.move,
          this.computer.move,
        );
        this.logMoves();
        if (
          this.gameRules.determineWinner(
            this.human.move,
            this.computer.move,
          ) !== "tie"
        ) this.incrementScore(this.winner);
      }
      console.clear();
      this.io.displayMoveHistory(this.moveHistory, this.gameRules);
      this.io.displayWinner(this.determineMatchWinner());
      if (!this.playAgain()) break;
      console.clear();
    }
    this.io.displayGoodbyeMessage();
  },
};

RPSGame.play();
