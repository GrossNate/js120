const readline = require("readline-sync");

/**
 * @callback rowLabelCallback
 * @param {number} [rowIndex]
 */

/**
 * @param {Array[]} columnsArray
 * @param {string} [title]
 * @param {string[]} [columnHeaders]
 * @param {rowLabelCallback} [rowLabelFunction]
 * @returns {string}
 */
function tablefy(
  columnsArray,
  title,
  columnHeaders,
  rowLabelFunction,
) {
  let showTitle = !(title === undefined);
  let showColumnHeaders = !(columnHeaders === undefined);
  let showRowLabels = !(rowLabelFunction === undefined);
  let columnWidths = columnsArray.map((column) => getMaxElementWidth(column));
  columnWidths = columnWidths.map((width, index) =>
    Math.max(width, columnHeaders[index].toString().length)
  );
  let rowLabelsWidth = showRowLabels
    ? getMaxElementWidth([rowLabelFunction(columnsArray[0].length - 1)])
    : 0;
  let returnString = "";
  if (showTitle) {
    let titleWidth = rowLabelsWidth + ((rowLabelsWidth > 0) ? 1 : 0) +
      columnWidths.reduce((sum, width) => sum + width + 1);
    returnString += "┌" + "─".repeat(titleWidth) + "┐\n";
    let leftPad = " ".repeat(Math.floor((titleWidth - title.length) / 2));
    let rightPad = " ".repeat(Math.ceil((titleWidth - title.length) / 2));
    returnString += "│" + leftPad + title + rightPad + "│\n";
  }
  if (showColumnHeaders) {
    returnString += (showTitle ? "├" : "┌") +
      (showRowLabels ? "─".repeat(rowLabelsWidth) + "┬" : "") +
      columnWidths.map((width) => "─".repeat(width)).join("┬") +
      (showTitle ? "┤\n" : "┐\n");
    returnString += "│" +
      (showRowLabels ? padRight("", rowLabelsWidth) + "│" : "") +
      columnHeaders
        .map((header, index) => padRight(header, columnWidths[index]))
        .join("│") +
      "│\n";
  }
  returnString += (showTitle || showColumnHeaders ? "├" : "┌") +
    (showRowLabels
      ? "─".repeat(rowLabelsWidth) + (showColumnHeaders ? "┼" : "┬")
      : "") +
    columnWidths.map((width) => "─".repeat(width)).join(
      showColumnHeaders ? "┼" : "┬",
    ) +
    (showTitle || showColumnHeaders ? "┤\n" : "┐\n");
  for (let i = 0; i < columnsArray[0].length; i += 1) {
    returnString += "│" +
      (showRowLabels
        ? rowLabelFunction(i) +
          " ".repeat(rowLabelsWidth - rowLabelFunction(i).length) + "│"
        : "") +
      columnsArray
        .map((column, index) => padRight(column[i], columnWidths[index]))
        .join("│") +
      "│\n";
  }
  returnString += "└" +
    (showRowLabels ? "─".repeat(rowLabelsWidth) + "┴" : "") +
    columnWidths.map((width) => "─".repeat(width)).join(
      "┴",
    ) +
    "┘";
  return returnString;
}

/**
 * Takes an array and returns the number of characters in the string
 * representations of the elements.
 * @param {Array} inputArray
 * @returns {number}
 */
function getMaxElementWidth(inputArray) {
  return Math.max(...(inputArray.map((element) => element.toString().length)));
}

/**
 * Takes a string and returns it padded to the specified width.
 * @param {string} inputString
 * @param {number} width
 * @returns {string}
 */
function padRight(inputString, width) {
  return inputString + " ".repeat(width - inputString.length);
}

function createGameRules() {
  /**
   * Takes an array of words and returns a map with the words as keys and then
   * the number of characters at the start of each word needed to assure that
   * they are distinct.
   * @param {string[]} choicesArray
   * @returns {Map<string, number>}
   */
  function findMinDistinctChars(choicesArray) {
    let minDistinctChars = new Map();
    choicesArray.forEach((choice) => minDistinctChars.set(choice, 0));

    choicesArray.forEach((choice) => {
      choicesArray.forEach((comparisonChoice) => {
        if (choice !== comparisonChoice) {
          for (let numChars = 1; numChars <= choice.length; numChars += 1) {
            if (
              choice.slice(0, numChars) !== comparisonChoice.slice(0, numChars)
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
  }

  let rulesObject = {
    NUM_ROUNDS: 3,
    CHOICES: new Map(),
    INPUT_CHOICES: new Map(),
  };
  rulesObject.CHOICES.set("rock", ["scissors", "lizard"]);
  rulesObject.CHOICES.set("paper", ["rock", "spock"]);
  rulesObject.CHOICES.set("scissors", ["paper", "lizard"]);
  rulesObject.CHOICES.set("lizard", ["spock", "paper"]);
  rulesObject.CHOICES.set("spock", ["rock", "scissors"]);
  rulesObject.CHOICES.forEach((_, key) =>
    rulesObject.INPUT_CHOICES.set(key, key)
  );
  findMinDistinctChars(Array.from(rulesObject.CHOICES.keys()))
    .forEach((value, key) =>
      rulesObject.INPUT_CHOICES.set(key.slice(0, value), key)
    );
  return rulesObject;
}

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    choose() {
      const choices = ["rock", "paper", "scissors"];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();
  let humanObject = {
    choose() {
      let choice;
      while (true) {
        console.log("Please choose rock, paper, or scissors:");
        choice = readline.question();
        if (["rock", "paper", "scissors"].includes(choice)) break;
        console.log("Sorry, invalid choice.");
      }
      this.move = choice;
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
  moveHistory: {
    humanMoves: [],
    computerMoves: [],
    logMove(player, move) {
      this[player + "Moves"].push(move);
    },
    getHistoryDisplay() {
      return tablefy([this.humanMoves, this.computerMoves], "Move History", [
        "Human",
        "Computer",
      ], (rowIndex) => `Round ${rowIndex + 1}`);
    },
  },
  score: { human: 0, computer: 0 },

  incrementScore(player) {
    this.score[player] += 1;
  },

  displayMoveHistory() {
    console.log(this.moveHistory.getHistoryDisplay());
  },

  displayWelcomeMessage() {
    console.log("Welcome to Rock, Paper, Scissors!");
  },

  displayGoodbyeMessage() {
    console.log("Thanks for playing Rock, Paper, Scissors");
  },

  logMoves() {
    this.moveHistory.logMove("human", this.human.move);
    this.moveHistory.logMove("computer", this.computer.move);
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);
    if (humanMove === computerMove) {
      console.log("It's a tie!");
    } else if (
      (humanMove === "rock" && computerMove === "scissors") ||
      (humanMove === "scissors" && computerMove === "paper") ||
      (humanMove === "paper" && computerMove === "rock")
    ) {
      this.incrementScore("human");
      console.log("You win!");
    } else {
      this.incrementScore("computer");
      console.log("Computer wins!");
    }
  },

  displayScore() {
    console.log(
      `The score is human: ${this.score.human}, computer: ${this.score.computer}.`,
    );
  },

  playAgain() {
    console.log("Would you like to play again? (y/n)");
    let answer = readline.question();
    return answer.toLowerCase()[0] === "y";
  },
  play() {
    console.clear();
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.logMoves();
      this.displayWinner();
      this.displayScore();
      this.displayMoveHistory();
      if (!this.playAgain()) break;
      console.clear();
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();
