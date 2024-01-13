// "use strict";

const a = {
  foo: 1,
};

const b = Object.create(a);

console.log(`a: ${a.foo}`);
console.log(`b: ${b.foo}`);

a.foo = 2;
console.log("reassigned a.foo");
console.log(`a: ${a.foo}`);
console.log(`b: ${b.foo}`);

b.foo = 1;
console.log("reassigned b.foo");
console.log(`a: ${a.foo}`);
console.log(`b: ${b.foo}`);

a.foo = 3;
console.log("reassigned a.foo");
console.log(`a: ${a.foo}`);
console.log(`b: ${b.foo}`);

console.log();

function assignProperty(obj, property, value) {
  if (obj === null) {
  } else if (obj.hasOwnProperty(property)) {
    obj[property] = value;
  } else {
    assignProperty(Object.getPrototypeOf(obj), property, value);
  }
}

let fooA = { bar: 1 };
let fooB = Object.create(fooA);
let fooC = Object.create(fooB);

assignProperty(fooC, "bar", 2);
console.log(fooA.bar); // 2
console.log(fooC.bar); // 2

assignProperty(fooC, "qux", 3);
console.log(fooA.qux); // undefined
console.log(fooC.qux); // undefined
console.log(fooA.hasOwnProperty("qux")); // false
console.log(fooC.hasOwnProperty("qux")); // false

function createInvoice(services) {
  let obj = {
    phone: 3000,
    internet: 5500,
    payments: [],
    total() {
      return this.phone + this.internet;
    },
    addPayment(payments) {
      payments = [].concat(payments);
      payments.forEach(payment => this.payments.push(payment));
    },
    addPayments(payments) {
      this.addPayment(payments);
    },
    amountDue() {
      // This should really calculate the amount due by only subtracting phone
      // and internet from the respective balances, but I'm just adding
      // everything together.
    return this.total() - this.payments.reduce((total, payment) => total + payment.total(), 0);
    }
  };
  if (typeof services === 'object') {
    for (let key in services) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = services[key];
      }
    }
  }
  return obj;
}

function invoiceTotal(invoices) {
  let total = 0;

  for (let index = 0; index < invoices.length; index += 1) {
    total += invoices[index].total();
  }

  return total;
}

let invoices = [];
invoices.push(createInvoice());
invoices.push(createInvoice({ internet: 6500 }));
invoices.push(createInvoice({ phone: 2000 }));
invoices.push(createInvoice({
  phone: 1000,
  internet: 4500,
}));

console.log(invoiceTotal(invoices)); // 31000

function createPayment(services) {
  let obj = {
    total() {
      return Object
        .values(this)
        .filter(value => typeof value === 'number')
        .reduce((sum,val) => sum + val, 0);
    }
  };
  if (services === undefined) {
    obj.amount = 0;
  } else {
    for (let key in services) {
      obj[key] = services[key];
    }
  }
  return obj;
}

function paymentTotal(payments) {
  return payments.reduce((sum, payment)  => sum + payment.total(), 0);
}

let payments = [];
payments.push(createPayment());
payments.push(createPayment({
  internet: 6500,
}));

payments.push(createPayment({
  phone: 2000,
}));

payments.push(createPayment({
  phone: 1000,
  internet: 4500,
}));

payments.push(createPayment({
  amount: 10000,
}));

console.log(paymentTotal(payments));      // => 24000

let invoice = createInvoice({
  phone: 1200,
  internet: 4000,
});

let payment1 = createPayment({ amount: 2000 });
let payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

let payment3 = createPayment({ phone: 1000 });

invoice.addPayment(payment1);
invoice.addPayments([payment2, payment3]);
console.log(invoice.amountDue());       // this should return 0

function createProduct(id, name, stock, price) {
  return {
    id,
    name,
    stock,
    price,
    describe() {
      console.log(`Name: ${this.name}`);
      console.log(`ID: ${this.id}`);
      console.log(`Price: ${this.price}`);
      console.log(`Stock: ${this.stock}`);
    },
    setPrice(price) {
      if (price > 0) {
        this.price = price;
      } else {
        console.log('Invalid price.');
      }
    }
  }
}

let scissors = createProduct(0, 'Scissors', 8, 10);
let drill = createProduct(1, 'Cordless Drill', 15);

scissors.describe();
drill.describe();

drill.setPrice(45);

drill.describe();

function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.started = false;

}
Car.prototype.start = function() {
    this.started = true;
  };

Car.prototype.stop = function() {
    this.started = false;
  };
let corolla = new Car('Toyota', 'Corolla', 2016);
let leaf = new Car('Nissan', 'LEAF', 2018);
let nova = new Car('Chevrolet', 'Nova', 1974);

console.log(nova);

console.log(nova.prototype);
console.log(Car.prototype);

function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.area = function() {
    return (this.radius ** 2) * Math.PI;
};

let a1 = new Circle(3);
let b1 = new Circle(4);

console.log(a1.area().toFixed(2)); // => 28.27
console.log(b1.area().toFixed(2)); // => 50.27
console.log(a1.hasOwnProperty('area')); // => false

