import _Error from 'isotropic-error';
import _make from 'isotropic-make';

const _InvalidInputError = _make(_Error, {
    _init (queryString) {
        this.name = 'InvalidInputError';

        if (queryString) {
            this.details = {
                input: queryString
            };
            this.message = `"${queryString}" is not a valid input string for node-roll.`;
        } else {
            this.message = 'No input string was supplied to node-roll.';
        }

        return this;
    }
});

export default _InvalidInputError;
