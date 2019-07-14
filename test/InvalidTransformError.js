import {
    describe,
    it
} from 'mocha';

import {
    expect
} from 'chai';

import InvalidTransformError from '../js/InvalidTransformError';

describe('InvalidTransformError', () => {
    it('should have the correct error name', () => {
        const error = new InvalidTransformError();

        expect(error.name).to.eql('InvalidTransformError');
    });

    it('should have the correct message with no input', () => {
        const error = new InvalidTransformError();

        expect(error.message).to.eql('Invalid transform implied, but no transform found.');
    });

    it('should have the correct message with input', () => {
        const badTransform = new Set([1, 3, 4]),
            error = new InvalidTransformError(badTransform);

        expect(error.message).to.eql(`Transforms of type ${typeof badTransform} are not a valid for node-roll.`);
    });
});
