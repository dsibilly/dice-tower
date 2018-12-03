# dice-tower

dice-tower is a node.js module for rolling dice and adding modifiers (e.g. "3d6+2"). This project was forked from [node-roll](https://github.com/troygoode/node-roll).

[![Build Status](https://travis-ci.org/dsibilly/dice-tower.svg?branch=master)](https://travis-ci.org/dsibilly/dice-tower) [![Coverage Status](https://coveralls.io/repos/github/dsibilly/dice-tower/badge.svg?branch=master)](https://coveralls.io/github/dsibilly/dice-tower?branch=master)

## How To Use (From Shell)

### Installation (via [npm](https://www.npmjs.com/package/@dsibilly/dice-tower))

```bash
$ npm install -g @dsibilly/dice-tower
```

### Usage

```bash
$ dice-tower 3d6+2
13
$ dice-tower d20
15
$ dice-tower d%
97
```

## How To Use (As Library)

### Installation (via [npm](https://www.npmjs.com/package/@dsibilly/dice-tower))

```bash
$ npm install @dsibilly/dice-tower
```

### Usage

Get an instance of the library:

```javascript
var DiceTower = require('@dsibilly/dice-tower'),
  diceTower = new DiceTower();
```

Rolling a single die:

```javascript
var oneDie = diceTower.roll('d6');
console.log(oneDie.result); // A pseudo-random number between 1 and 6 (inclusive)
```

Rolling multiple dice:

```javascript
var twoTwenties = diceTower.roll('2d20');
console.log(twoTwenties.result); // A pseudo-random number between 2 and 40 (inclusive)
```

Rolling multiple sets of dice:

```javascript
var bunchOfDice = diceTower.roll('2d20+1d12');
console.log(bunchOfDice.result); // A pseudo-random number between 3 and 52 (inclusive)
```

Rolling a percentage:

```javascript
var chance = diceTower.roll('d%'); // ...or '1d100', 'd100', or '1d%'
console.log(chance.result); // A pseudo-random number between 1 and 100 (inclusive)
```

Simple calculation (+, -, *, /):

```javascript
var attack = diceTower.roll('2d6+2');
console.log(attack.result); // A pseudo-random number between 3 and 8 (inclusive)
```

Seeing what was rolled, rather than the sum:

```javascript
const yahtzee = diceTower.roll('5d6');
console.log(yahtzee.rolled); // `yahtzee.rolled` will return an Array, e.g. [5, 2, 4, 6, 1]

const blessedSneaker = diceTower.roll('2d20b1+1d4+5');
console.log(blessedSneaker.rolled); // blessedSneaker.rolled will return an Array containing an Array for each component that is a roll of the dice, in the order in which they occurred, e.g. [[19,3],[1]]
```

Getting the highest two dice of the set:

```javascript
var pickBestTwo = diceTower.roll('6d20b2'); // roll 6 dice and sum the 2 highest results
console.log(pickBestTwo.calculations[1]); // pickBestTwo.calculations[0] is the same as .result, .calculations[1] is prior to the sum operation
```

Processing rolls without parsing a string:

```javascript
// Same as 2d6+2:
const attack = diceTower.roll({
        quantity: 2,
        sides: 6,
        transformations: [ // List arbitrary pipeline operations to perform on the result.
            'sum', // Sum the result array of rolled dice together...
            ['add', 2] // ...and add 2 to that sum.
        ]
    });
    console.log(attack.result); // Outputs a pseudo-random number between 4 and 14, inclusive.
```

Using custom transformations:

```javascript
const dropOnes = function(results){
        return results.filter(function (result) {
            return result !== 1;
        });
    },
    noOnes = diceTower.roll({
        quantity: 5,
        sides: 4,
        transformations: [
            dropOnes, // remove any rolled 1s
            'sum'
        ]
    });
```

Using a custom seed:

```javascript
const srand = require('srand'); // https://github.com/isaacs/node-srand
srand.seed(Math.floor(Math.random() * 1000));

diceTower = new DiceTower(function () {
  return srand.random();
});

console.log(diceTower.roll('2d6+5').result);
```

Validating user input:

```javascript
const userInput = 'this isn\'t a valid roll',
  valid = DiceTower.validate(userInput);

if (!valid) {
  console.error(`"${userInput}" is not a valid input string for node-roll!`);
}
```

## Credits
Forked from [Troy Goode](https://github.com/TroyGoode/)'s node-roll module.
node-roll originally inspired by [Phillip Newton's Games::Dice](http://search.cpan.org/~pne/Games-Dice-0.02/Dice.pm).

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Maintainer
[Duane Sibilly](https://github.com/dsibilly/)

## Contributors
- Mark Funk
- [Connor Sauve](https://github.com/csauve/)
- [cajahnke](https://github.com/cajahnke/)
