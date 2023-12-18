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
- `Object.keys()` is how to get the enumerable properties of an object.
