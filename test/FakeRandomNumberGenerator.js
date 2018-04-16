import _make from 'isotropic-make';

const FakeRandomNumberGenerator = _make({
    _init (numbers) {
        this.pointer = 0;
        this.numbers = numbers;

        return this;
    },

    reset () {
        this.pointer = 0;
    },

    next () {
        this.pointer += 1;

        if (this.pointer > this.numbers.length) {
            this.pointer = 1;
        }

        return this.numbers[this.pointer - 1];
    }
});

export default FakeRandomNumberGenerator;
