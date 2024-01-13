function ObjectMaker(foo, bar) {
  this.foo = foo;
  this.bar = bar;
  this.showFoo = function() {
    console.log(this.foo);
  }
}

ObjectMaker.prototype.showBar = function() {
  console.log(this.bar);
}

ObjectMaker.showClassMethod = function() {console.log('blargh')};

const testObject = new ObjectMaker("my foo", "my bar");

testObject.showFoo();

testObject.showBar();

console.log(testObject.hasOwnProperty('showFoo'));
console.log(testObject.hasOwnProperty('showBar'));

ObjectMaker.showClassMethod(testObject);

console.log(ObjectMaker.prototype);
console.log(ObjectMaker.__proto__);
console.log(Object.getPrototypeOf(ObjectMaker));

console.log(testObject.prototype);
console.log(testObject.__proto__);
console.log(testObject.constructor);
console.log(ObjectMaker.prototype.constructor);

console.log(Object.getPrototypeOf(testObject));
console.log(ObjectMaker.name);
