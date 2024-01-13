- Object property keys are _always_ strings.
- dot notation is also called "member access notation"
- bracket notation is called "computed mamber access notation"
- `in` is the way to check if a key is in an object, regardless of whether it's
  enumerable or inherited
  - But note that `for ... in` only covers enumerable properties (this somewhat
    makes sense)
- `.hasOwnProperty()` is the way to check if a key is in an object, but only if
  it's enumerable and not inherited
- `Object.getOwnProperties()` is how you get non-inherited properties regardless
  of whether they're enumerable.
- `Object.keys()` is how to get the enumerable **own** properties of an object.
- function definition = any sort of function
- function declaration = line starts with `function`
- function expression = function definitions that are not function declarations

# Practice Problems: Object Prototypes

1. Will log `2`.
2. Will log `3`.
3. Will log `4`.
4.
5. Yes, should be the same. _WRONG_ - the second loop only iterates over own
   properties, whereas the first one includes the inherited properties as well.
6. `let foo = Object.create(null);`

# Practice Problems: Implicit and Explicit Function Execution Contexts

1. `[Function: func]` **WRONG** it's `global`
2. `[Object obj]`, because it's a method call it's executed within the context
   of the object.
3. `Hello from the global scope!` then `Hello from the function scope!`
4. `call` and `apply`
5. `bar.add.call(foo)` will return 3

# Practice Problems: Hard Binding Functions with Contexts

1. `bind`
2. `[Function: anonymous]` (nothing)
3. `undefined undefined`, then `5` **WRONG** the first one will be `NaN`
4. `JavaScript makes sense!`
5. `Amazebulous!`

functions get their context from how they're invoked (not where they're invoked
or where they're defined) - _except_ arrow functions have the same context as
when it was created.

# Practice Problems: Dealing with Context Loss

1. `undefined undefined is a undefined.` because the method is invoked in the
   context of the `logReturnVal` function **SLIGHTLY WRONG** this is actually
   pointing to the global object
2. Here:
   ```javascript
   function logReturnVal(func, thisArg) {
     let returnVal = func.call(thisArg);
     console.log(returnVal);
   }
   ```
3. Here:
   ```javascript
   const getDescription = turk.getDescription.bind(turk);
   ```
4. No, because the anonymous function that's passed as an argument to `forEach`
   has `this` = global. (Functions lose their surrounding context when passed as
   arguments to other functions)
5. Here:

   ```javascript
   const TESgames = {
     titles: ["Arena", "Daggerfall", "Morrowind", "Oblivion", "Skyrim"],
     seriesTitle: "The Elder Scrolls",
     listGames: function () {
       let self = this;
       this.titles.forEach(function (title) {
         console.log(self.seriesTitle + ": " + title);
       });
     },
   };

   TESgames.listGames();
   ```

6. Here:

   ```javascript
   const TESgames = {
     titles: ["Arena", "Daggerfall", "Morrowind", "Oblivion", "Skyrim"],
     seriesTitle: "The Elder Scrolls",
     listGames: function () {
       this.titles.forEach(function (title) {
         console.log(this.seriesTitle + ": " + title);
       }, this);
     },
   };

   TESgames.listGames();
   ```

7. Here:

   ```javascript
   const TESgames = {
     titles: ["Arena", "Daggerfall", "Morrowind", "Oblivion", "Skyrim"],
     seriesTitle: "The Elder Scrolls",
     listGames: function () {
       this.titles.forEach((title) => {
         console.log(this.seriesTitle + ": " + title);
       });
     },
   };

   TESgames.listGames();
   ```

8. 3? **WRONG** because "it's invoked as a function".
9. Change line 8 to:
   ```javascript
   increment.call(this);
   ```
10.

- **Absolutely need to go back and review invocation context**

# Practice Problems - Factory Functions

1. Every object has all the methods (why is this a disadvantage?) and you don't
   actually know what type of object it is (there's no class to it).
2. Here:
   ```javascript
   function makeObj() {
     return {
       propA: 10,
       propB: 20,
     };
   }
   ```

# Problems in Constructors

1. constructor functions should start with a capital letter. (but that's just a
   convention, not a language requirement)
2. Nothing happens since `scamper()` is undefined (because we didn't call the
   constructor with `new`) **WRONG** you get a TypeError (cannot read properties
   of undefined).
3. Just add a `new` before `Lizard()` on line 7.

# Practice Problems - Constructors and Prototypes

1. `NaN` for both, because the invocation context of `RECTANGLE.area()` is the
   `RECTANGLE` object since it was called as a method on that object. There are
   no `width` and `height` properties defined, so it returns
   (`undefined * undefined`), which is `NaN`
2. I'd add parameters to the functions in `RECTANGLE` and pass in the `width`
   and `height` when calling them. **GIVEN ANSWER** use `.call(this)`
3. See other file.
4. `true` because there's only one prototype for the Ninja-type objects.
5. `true` for the same reason as #4 - this is just basically a different way of
   doing the same thing. **WRONG, VERY WRONG** - this reassigns the prototype to
   point to a different object, so the prototype of `ninja` doesn't change.
6. Here:
   ```javascript
   Ninja.prototype.swung = function() {
       this.swung = true;
       return this;
   }
   ```
   **IMPORTANT POINT** to make your methods "chainable" you need to return the 
   context object.
7. `let ninjaB = new ninjaA.constructor();`
8. Here:
   ```javascript
   function User(first, last) {
       if (this === global) {
           return new User(first, last);
       } else {
           this.name = `${first} ${last}`;
       }
   }
   ```
   **PROBABLY WRONG** - should use `!(this instanceof User)` instead.
   **IMPORTANT POINT** this technique is called a "scope-safe constructor"

# `class` keyword
Lots of important stuff here: https://launchschool.com/gists/6ba85481


# Practice Problems - Classes

1. classes are first-class values in that they are objects and can be passed as
   arguments to functions.  i.e. they can be used anywhere a value is expected.
2. It makes the manufacturer a method of the class rather than the object
   instances. To call it we use `Television.manufacturer()`
