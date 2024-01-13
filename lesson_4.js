// # Question 1
// function createPet(animalType, name) {
//   return {
//     animal: animalType,
//     name: name,
//     sleep: function() {
//       console.log("I am sleeping");
//     },
//     wake: function() {
//       console.log("I am awake");
//     }
//   }
// }
//
// let pudding = createPet("Cat", "Pudding");
// console.log(`I am a ${pudding.animal}. My name is ${pudding.name}.`);
// pudding.sleep(); // I am sleeping
// pudding.wake();  // I am awake
//
// let neptune = createPet("Fish", "Neptune");
// console.log(`I am a ${neptune.animal}. My name is ${neptune.name}.`);
// neptune.sleep(); // I am sleeping
// neptune.wake();  // I am awake

// # Question 2
// const PetPrototype = {
//   init: function (animal, name) {
//     this.animal = animal;
//     this.name = name;
//     return this;
//   },
//   sleep: function () {
//     console.log("I am sleeping");
//   },
//   wake: function () {
//     console.log("I am awake");
//   },
// };
//
// let pudding = Object.create(PetPrototype).init("Cat", "Pudding");
// console.log(`I am a ${pudding.animal}. My name is ${pudding.name}.`);
// pudding.sleep(); // I am sleeping
// pudding.wake();  // I am awake
//
// let neptune = Object.create(PetPrototype).init("Fish", "Neptune");
// console.log(`I am a ${neptune.animal}. My name is ${neptune.name}.`);
// neptune.sleep(); // I am sleeping
// neptune.wake();  // I am awake

// # Question 3
// In the first example, each object has its own copy of the `sleep()` and 
// `wake()` methods, but in the second example those methods are only defined in
// the `PetPrototype` object, but accessed through the prototypal chain.
// ***MISSING FROM MY ANSWER*** Objects created with factory functions can have
// private state!

// function createPet(animalType, name) {
//   const privateState = {age: 0};
//   return {
//     animal: animalType,
//     name: name,
//     sleep: function() {
//       console.log("I am sleeping");
//     },
//     wake: function() {
//       console.log("I am awake");
//     },
//     showAge: function() {
//       console.log(`I am ${privateState.age} years old.`);
//     },
//     haveBirthday: function() {
//       privateState.age += 1;
//     }
//   }
// }
//
// let pudding = createPet("Cat", "Pudding");
// console.log(`I am a ${pudding.animal}. My name is ${pudding.name}.`);
// pudding.sleep(); // I am sleeping
// pudding.wake();  // I am awake
// pudding.showAge();
//
// let neptune = createPet("Fish", "Neptune");
// console.log(`I am a ${neptune.animal}. My name is ${neptune.name}.`);
// neptune.sleep(); // I am sleeping
// neptune.wake();  // I am awake
// neptune.haveBirthday();
// neptune.showAge();
//
// pudding.showAge();

// # Lesson 4 - 6 Practice Problems: Subtyping with Classes
class Greeting {
  greet(greeting) {
    console.log(greeting);
  }
}

class Hello extends Greeting {
  hi() {
    this.greet("Hello");
  }
}

class Goodbye extends Greeting {
  bye() {
    this.greet("Bye");
  }
}
