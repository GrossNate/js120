# Observations from playing with Umbra embedded in Gathertown

## Overall I prefer Umbra to Coderpads

Despite the small shortcomings (lack of vi keybindings and the stuff listed
below) I still prefer the embedded solution. And I love not having to sign in
each time! Just sit down at a "computer" and start working. I think to make
Gathertown a success, an embedded solution like this is imperative. I really
don't like the idea of using Gathertown for video/audio and Coderpad for shared
coding - the only times yesterday that we reverted to using Coderpad, I just
left Gathertown entirely and used the audio/video in Coderpad itself.

## Timeout seems like less than 3 seconds

```javascript
for (let i = 0; i < 1000; i += 1) {
  console.log(`iteration number ${i} ${Math.random()}`);
}
```

This results in only 27 iterations. Without the `${Math.random}` you get 52
iterations. Seems like it times out way faster than 3 seconds.

## Weird, unhelpful display of objects

```javascript
let arr = [];
console.log(`Object.getPrototypeOf(arr): `, Object.getPrototypeOf(arr));
console.log("Array.prototype: ", Array.prototype);
Array.prototype.hello = function () {
  return "hello";
};
console.log(arr.hello());
console.log(Object.getPrototypeOf(arr));
console.log(Array.prototype.hasOwnProperty("hello"));
```

Results in:

```
Object.getPrototypeOf(arr):  []
Array.prototype:  []
hello
[]
true
```

Whereas in node we get:

```
Object.getPrototypeOf(arr):  Object(0) []
Array.prototype:  Object(0) []
hello
Object(0) [ hello: [Function (anonymous)] ]
true
```

Since I'm in JS120, this is a *temporary* deal-breaker for me when trying to
play with and understand object prototypes. The person I was studying with
yesterday was game to try out Umbra, but once we discovered this issue he
gently insisted we switch back to a Coderpad (and I agree with him).

## Would be nice to see when code has been executed and output is unchanged

Would be good to have some indicator of whether new code has been executed. (The
output box is completely replaced with each execution, so sometimes it's not
clear if the changes have had no effect or if you just haven't clicked 'Run'.)
I added a `console.log(Date());` to the bottom of my code, but it would be
better to have it built into Umbra.
