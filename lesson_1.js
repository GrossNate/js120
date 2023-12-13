console.log("7. Functions as Object Factories");

function createCar(make, fuelLevel, engineOn) {
  return {
    'make': make,
    'fuelLevel': fuelLevel,
    'engineOn': engineOn,
    drive() {
      this.fuelLevel -= 0.1;
    }
  }
}

let raceCar1 = createCar('BMW', 0.5, false);
raceCar1.drive();

let raceCar2 = createCar('Ferrari', 0.7, true);
raceCar2.drive();

console.log(raceCar2);

let raceCar3 = createCar('Jaguar', 0.4, false);

////////////////////////////////////////////
console.log();
console.log("8. Practice Problems: Objects and Factories");

function createBook(title, author) {
  return {
    title,
    author,
    read: false,
    getDescription() {
      return `${this.title} was written by ${this.author}. I have${this.read ? "" : "n't"} read it.`;
    },
    readBook() {
      this.read = true;
    }
  }
}

let book1 = createBook("Mythos", "Stephen Fry");
let book2 = createBook("Me Talk Pretty One Day", "David Sedaris");
let book3 = createBook("Aunts aren't Gentlemen", "PG Wodehouse");

console.log(book2.getDescription());
console.log(book1.getDescription());
book1.readBook();
console.log(book1.getDescription());
