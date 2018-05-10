export default (rolledDice, value) => rolledDice.sort((a, b) => a - b).slice(0, value);
