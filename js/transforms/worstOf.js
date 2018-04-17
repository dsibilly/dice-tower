export default (rolledDice, value) => {
    const sorted = rolledDice.sort((a, b) => a - b);

    return sorted.reduce((memo, item, index) => {
        if (index < (value / 1)) {
            memo.push(item);
        }

        return memo;
    }, []);
};
