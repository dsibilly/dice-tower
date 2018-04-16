import {
    describe,
    it
} from 'mocha';

import {
    expect
} from 'chai';

import InvalidInputError from '../js/InvalidInputError';

describe('InvalidInputError', () => {
    it('should have the correct error name', () => {
        const error = new InvalidInputError();

        expect(error.name).to.eql('InvalidInputError');
    });

    it('should have the correct message with no input', () => {
        const error = new InvalidInputError();

        expect(error.message).to.eql('No input string was supplied to node-roll.');
    });

    it('should have the correct message with input', () => {
        const queryString = Math.floor(Math.random() * 1000),
            error = new InvalidInputError(queryString);

        expect(error.message).to.eql(`"${queryString}" is not a valid input string for node-roll.`);
    });
});
