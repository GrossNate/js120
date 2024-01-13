function foo() {
  console.log(this);
}

foo();

const bar = {
  foo() {
    console.log(this);
  },
  baz() {
    const self = this;
    function foo() {
      console.log(self);
    }
    foo();
  }
};

bar.foo();

bar.baz();

const qux = bar.baz;

qux();
