export default (rolledDice, value) => rolledDice.sort((a, b) => b - a).slice(0, value);
