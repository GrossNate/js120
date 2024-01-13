# Lesson 4 - 4 Subtyping with Constructors and Prototypes

## Practice Problems

1. 'Hello!' is logged to the console.
2. An error because there's no method in the object's prototypal chain
   (TypeError, hello.bye is not a function)
3. 'undefined' is logged to the console since we didn't pass an argument (but
   the `greet()` method is found in the object's prototypal chain)
4. 'Goodbye'
5. TypeError, Hello.hi is not a function

**NOTE:** just like functions, there's a difference between class declarations
and class expressions

# Lesson 4 - 6 Practice Problems: Subtyping with Classes

1. That's fine - it "overrides" the method in the superclass
2.

# Lesson 4 - 8 Code Re-use with mixins

## Practice Problem

1. Insert a line after 11 as follows: `Object.assign(Car.prototype, Speed);`
2. Using `this.constructor.name` because the method has been added to the
   `Car.prototype` object, `this` will reference the object context (assuming
   it's called as a method)
