import {
    beforeEach,
    describe,
    it
} from 'mocha';

import {
    exec
} from 'child_process';

import {
    expect
} from 'chai';

import FakeRandomNumberGenerator from './FakeRandomNumberGenerator';
import Roll from '../js/index';

describe('node-roll', () => {
    // can only test this library if we make things not actually random
    const fakeRandomNumberGenerator = new FakeRandomNumberGenerator([
            0.24, // 20 * .24 =>  4.8 =>  5
            0.62, // 20 * .62 => 12.4 => 13
            0.51, // 20 * .51 => 10.2 => 11
            0.13, // 20 * .13 =>  2.6 =>  3
            0.66, // 20 * .66 => 13.2 => 14
            0.33, // 20 * .66 =>  6.6 =>  7
            0.12 // 20 * .12 =>  2.4 =>  2
        ]),
        fixedRoller = new Roll(fakeRandomNumberGenerator.next.bind(fakeRandomNumberGenerator)),
        roller = new Roll();

    beforeEach(fakeRandomNumberGenerator.reset.bind(fakeRandomNumberGenerator));

    it('validates input strings', done => {
        try {
            roller.roll('garbage');
            done('Should not be reachable');
        } catch (error) {
            expect(error.name).to.eql('InvalidInputError');
            expect(error.message).to.eql('"garbage" is not a valid input string for node-roll.');
            expect(error.details.input).to.eql('garbage');
            done();
        }
    });

    it('exposes validation as static method', () => {
        expect(Roll.validate('2d20+3')).to.be.true;
        expect(Roll.validate('garbage')).to.be.false;
    });

    it('uses custom transformation arrays correctly', () => {
        const result = fixedRoller.roll({
            quantity: 2,
            sides: 20,
            transformations: [
                'sum',
                [
                    'add',
                    2
                ]
            ]
        });

        expect(result.rolled.length).to.eql(2);
        expect(result.rolled[0]).to.eql(5);
        expect(result.rolled[1]).to.eql(13);
        expect(result.result).to.eql(20);
    });

    it('uses custom transformation functions correctly', () => {
        const dropOnes = results => results.filter(result => result !== 1),
            result = roller.roll({
                quantity: 5,
                sides: 4,
                transformations: [
                    dropOnes, // Remove any 1s
                    'sum'
                ]
            }),
            sumWithoutOnes = result.rolled.filter(die => die !== 1).reduce((sum, die) => sum + die, 0);

        expect(result.rolled.length).to.eql(5);
        expect(result.result).to.eql(sumWithoutOnes);
    });

    it('fails properly with no input', done => {
        try {
            roller.roll();
            done('Should not be reachable');
        } catch (error) {
            expect(error.name).to.eql('InvalidInputError');
            expect(error.message).to.eql('No input string was supplied to node-roll.');
            done();
        }
    });

    describe('single die rolls', () => {
        it('d20', () => {
            const result = fixedRoller.roll('d20');

            expect(result.rolled.length).to.eql(1);
            expect(result.rolled[0]).to.eql(5);
            expect(result.result).to.eql(5);
        });

        it('percentile die', () => {
            const result = fixedRoller.roll('d%');

            expect(result.rolled.length).to.eql(1);
            expect(result.rolled[0]).to.eql(25);
            expect(result.result).to.eql(25);
        });
    });

    describe('multi die rolls', () => {
        it('2d20', () => {
            const result = fixedRoller.roll('2d20');

            expect(result.rolled.length).to.eql(2);
            expect(result.rolled[0]).to.eql(5);
            expect(result.rolled[1]).to.eql(13);
            expect(result.result).to.eql(18);
        });

        it('1d20 + 2d20', () => {
            const result = fixedRoller.roll('1d20+2d20');

            expect(result.rolled.length).to.eql(2);
            expect(result.rolled[0][0]).to.eql(11);
            expect(result.rolled[1][0]).to.eql(5);
            expect(result.rolled[1][1]).to.eql(13);
            expect(result.result).to.eql(29);
        });

        it('1d20 + 2d20 + 3d20', () => {
            const result = fixedRoller.roll('1d20+2d20+3d20');

            expect(result.rolled.length).to.eql(3);
            expect(result.rolled[0][0]).to.eql(7);
            expect(result.rolled[1][0]).to.eql(5);
            expect(result.rolled[1][1]).to.eql(13);
            expect(result.rolled[2][0]).to.eql(11);
            expect(result.rolled[2][1]).to.eql(3);
            expect(result.rolled[2][2]).to.eql(14);
            expect(result.result).to.eql(53);
        });

        it('Yahtzee', () => {
            const result = fixedRoller.roll('5d6');

            expect(result.rolled.length).to.eql(5);
            expect(result.rolled[0]).to.eql(2);
            expect(result.rolled[1]).to.eql(4);
            expect(result.rolled[2]).to.eql(4);
            expect(result.rolled[3]).to.eql(1);
            expect(result.rolled[4]).to.eql(4);
            expect(result.result).to.eql(15);
        });

        it('Double Yahtzee', () => {
            const result = fixedRoller.roll('5d6+5d6');

            expect(result.rolled.length).to.eql(2);
            expect(result.rolled[0][0]).to.eql(2);
            expect(result.rolled[0][1]).to.eql(1);
            expect(result.rolled[0][2]).to.eql(2);
            expect(result.rolled[0][3]).to.eql(4);
            expect(result.rolled[0][4]).to.eql(4);
            expect(result.rolled[1][0]).to.eql(2);
            expect(result.rolled[1][1]).to.eql(4);
            expect(result.rolled[1][2]).to.eql(4);
            expect(result.rolled[1][3]).to.eql(1);
            expect(result.rolled[1][4]).to.eql(4);
            expect(result.result).to.eql(28);
        });
    });

    describe('die rolls with modifiers', () => {
        it('2d20 + 3', () => {
            const result = fixedRoller.roll('2d20+3');

            expect(result.result).to.eql(21); // SUM + 3
        });

        it('2d20 - 3', () => {
            const result = fixedRoller.roll('2d20-3');

            expect(result.result).to.eql(15);
        });

        it('2d20 * 3', () => {
            const result = fixedRoller.roll('2d20*3');

            expect(result.result).to.eql(54);
        });

        it('2d20 / 3', () => {
            const result = fixedRoller.roll('2d20/3');

            expect(result.result).to.eql(6);
        });

        it('5d20, Best 1', () => {
            const result = fixedRoller.roll('5d20b1');

            expect(result.result).to.eql(14);
        });

        it('5d20, Best 2', () => {
            const result = fixedRoller.roll('5d20b2');

            expect(result.calculations[1].length).to.eql(2);
            expect(result.calculations[1][0]).to.eql(14);
            expect(result.calculations[1][1]).to.eql(13);
            expect(result.result).to.eql(27);
        });

        it('5d20, Worst 1', () => {
            const result = fixedRoller.roll('5d20w1');

            expect(result.result).to.eql(3);
        });

        it('5d20, Worst 2', () => {
            const result = fixedRoller.roll('5d20w2');

            expect(result.calculations[1].length).to.eql(2);
            expect(result.calculations[1][0]).to.eql(3);
            expect(result.calculations[1][1]).to.eql(5);
            expect(result.result).to.eql(8);
        });
    });

    describe('CLI utility', () => {
        const command = process.platform === 'win32' ?
            'node ././bin/roll' :
            `${__dirname}/../bin/roll`;

        it('correctly outputs results', done => {
            exec(`${command} 2d20`, (error, stdout) => {
                if (error) {
                    done(error);
                    return;
                }

                expect(/^\d+\n$/.test(stdout)).to.be.true;
                done();
            });
        });

        it('rejects garbage input', done => {
            exec(`${command} garbage`, (error, stdout, stderr) => {
                if (error) {
                    expect(stderr).to.equal('InvalidInputError: "garbage" is not a valid input string for node-roll.\n');
                    done();
                    return;
                }

                done('Should not be reachable');
            });
        });
    });
});
