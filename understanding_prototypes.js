class BigFoo {
  constructor(bigFooProperty) {
    this.bigFooProperty = bigFooProperty;
  }
  bigFooFunction() {
    console.log(
      "bigFooFunction invoked on '",
      Object.getPrototypeOf(this),
      "' type of object");
  }
}

class LittleFoo extends BigFoo {
  constructor(littleFooProperty, bigFooProperty) {
    super(bigFooProperty);
    this.littleFooProperty = littleFooProperty;
  }
  littleFooFunction() {
    console.log("littleFooFunction invoked");
  }
}

const bigFoo = new BigFoo("bigFooPropertyValue");
const littleFoo = new LittleFoo("littleFooPropertyValue",
  "littleFooBigFooPropertyValue");

console.log('bigFoo: ', bigFoo);
console.log('littleFoo: ', littleFoo);

bigFoo.bigFooFunction();
littleFoo.bigFooFunction();

console.log('BigFoo.prototype: ', BigFoo.prototype);

console.log(Date());
