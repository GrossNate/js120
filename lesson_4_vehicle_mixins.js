const Wheeled = {
  tirePressure(tireIdx) {
    return this.tires[tireIdx];
  },
  inflateTire(tireIdx, pressure) {
    this.tires[tireIdx] = pressure;
  },
}

class Vehicle {
  constructor(kmTravelledPerLiter, fuelCapInLiter) {
    this.fuelEfficiency = kmTravelledPerLiter;
    this.fuelCap = fuelCapInLiter;
  }
  range() {
    return this.fuelCap * this.fuelEfficiency;
  }
}

class Auto extends Vehicle {
  constructor() {
    // the array represents tire pressure for four tires
    super(50, 25.0);
    this.tires = [30,30,32,32]; 
  }
}
Object.assign(Auto.prototype, Wheeled);

class Motorcycle extends Vehicle {
  constructor() {
    // array represents tire pressure for two tires
    super(80, 8.0);
    this.tires = [20,20]; 
  }
}
Object.assign(Motorcycle.prototype, Wheeled);

class Catamaran extends Vehicle {
  constructor(propellerCount, hullCount, kmTravelledPerLiter, fuelCapInLiter) {
    super(kmTravelledPerLiter, fuelCapInLiter)
    // catamaran specific logic
    this.propellerCount = propellerCount;
    this.hullCount = hullCount;
  }
}

const myCar = new Auto();
const myMotorcycle = new Motorcycle();
const myCat = new Catamaran(2, 2, 50, 300);

console.log(myCar);
console.log(myMotorcycle);
console.log(myCat);

console.log(myCar.range());
console.log(myCat.range());

console.log(myMotorcycle.tirePressure(0));
