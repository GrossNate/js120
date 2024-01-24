function Animal(isAlive) {
  this.isAlive = isAlive;
}
Animal.prototype.respirate = function() {console.log("Breathing . . .");};

// By the book
function Mammal(isAlive) {
  Animal.call(this, isAlive);
}
Mammal.prototype = Object.create(Animal.prototype);
Mammal.prototype.keepBloodWarm = function() {console.log("Keeping my blood warm.");};
Mammal.prototype.constructor = Mammal;

// Getting creative
function Reptile(isAlive) {
  Animal.call(this, isAlive);
}
Object.setPrototypeOf(Reptile.prototype, Animal.prototype);
Reptile.prototype.constructor = Reptile;

function Lizard(isAlive) {
  Mammal.call(this, isAlive);
}
Object.setPrototypeOf(Lizard.prototype, Reptile.prototype);
Lizard.prototype.constructor = Lizard;
Lizard.prototype.shedSkin = function() {console.log('Shedding my skin.')};

console.log('Animal.prototype:\n', Animal.prototype);
console.log('Mammal.prototype:\n', Mammal.prototype);
console.log('Reptile.prototype:\n', Reptile.prototype);
console.log('Lizard.prototype:\n', Lizard.prototype);

const lizzo = new Lizard(true);
lizzo.respirate();

const mickey = new Animal(true);
mickey.shedSkin();
