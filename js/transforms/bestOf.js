export default (rolledDice, value) => {
    const sorted = rolledDice.sort((a, b) => b - a);

    return sorted.reduce((memo, item, index) => {
        if (index < (value / 1)) {
            memo.push(item);
        }

        return memo;
    }, []);
};
