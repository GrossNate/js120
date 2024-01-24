let arr = [];
console.log(`Object.getPrototypeOf(arr): `, Object.getPrototypeOf(arr));
console.log("Array.prototype: ", Array.prototype);
Array.prototype.hello = function () {
  return "hello";
};
console.log(arr.hello());
console.log(Object.getPrototypeOf(arr));
console.log(Array.prototype.hasOwnProperty("hello"));
