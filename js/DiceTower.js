import _make from 'isotropic-make';
import InvalidInputError from './InvalidInputError';
import MersenneTwister from './MersenneTwister';
import transformFunctions from './transforms';
import transformKeys from './keys';

const DiceTower = _make({
    _init (seedFunction) {
        if (seedFunction) {
            this._seedFunction = seedFunction;
        } else {
            this.__generator = new MersenneTwister();

            this._seedFunction = () => this.__generator.random();
        }

        this._filler = [];

        return this;
    },

    _parse (diceString) {
        if (!DiceTower.validate(diceString)) {
            throw new InvalidInputError(diceString);
        }

        const match = DiceTower._regex.exec(diceString),
            quantity = match[1], // 2d20+3 => 2
            segments = diceString.split(/[+-]/),
            sides = match[2], // 2d20+3 => 20
            hasTransformation = !!match[3], // 2d20+3 => true
            transforms = [];

        let operator,
            opIndex = 0,
            outsideRoll,
            transformationParameter;

        if (segments[0].indexOf('b') !== -1) {
            // A bestOf query...
            transforms.push(transformKeys[match[4]](parseInt(match[5], 10)));
        }

        for (let s = 1; s < segments.length; s += 1) {
            opIndex += segments[s - 1].length;
            operator = diceString[opIndex]; // 2d20+3 => '+'
            opIndex += 1;
            transformationParameter = segments[s]; // 2d20+3 => 3

            if (transformationParameter.indexOf('d') === -1) {
                transforms.push(transformKeys[operator](parseInt(transformationParameter, 10)));
            } else {
                // Transformation is another roll...
                outsideRoll = this.roll(transformationParameter, true);
                transforms.push(transformKeys[operator](outsideRoll.result));
            }
        }

        return {
            quantity: quantity ?
                parseInt(quantity, 10) :
                1,
            sides: sides === '%' ?
                100 :
                parseInt(sides, 10),
            transformations: hasTransformation || transforms.length !== 0 ?
                transforms.length === 0 ?
                    transformKeys[match[4]](parseInt(match[5], 10)) :
                    transforms :
                ['sum'],
            toString () {
                return diceString;
            }
        };
    },

    roll (query, invokedByParse) {
        if (!query) {
            throw new InvalidInputError();
        }

        if (typeof query === 'string') {
            query = this._parse(query);
        }

        const rolled = [];

        let calculations = [],
            carryFiller = [],
            cleaner,
            sumResult = false;

        while (rolled.length < query.quantity) {
            rolled.push(Math.floor((this._seedFunction() * query.sides) + 1));
        }

        this._filler.push(rolled);

        calculations = query.transformations.reduce((previous, transformation) => {
            let transformationFunction,
                transformationAdditionalParameter,
                sumParam = false;

            if (typeof transformation === 'function') {
                transformationFunction = transformation;
            } else if (typeof transformation === 'string') { // 'sum'
                transformationFunction = transformFunctions[transformation];
            } else if (transformation instanceof Array) { // [ 'add', 3 ]
                if (transformation[0] instanceof Array) {
                    sumResult = true;
                    cleaner = transformation[1];
                    transformation = transformation[0];
                } else if (transformation[1] instanceof Array) {
                    sumParam = true;
                    cleaner = transformation[0];
                    transformation = transformation[1];
                }

                transformationFunction = transformFunctions[transformation[0]]; // fn for 'add'
                transformationAdditionalParameter = transformation[1];
            }

            if (sumParam && previous[0] instanceof Array) {
                previous[0] = transformFunctions[cleaner](previous[0]);
            }

            previous.unshift(transformationFunction(previous[0], transformationAdditionalParameter));

            return previous;
        }, [
            rolled
        ]);

        if (sumResult === true && calculations[0] instanceof Array) {
            calculations[1] = calculations[0];
            calculations[0] = transformFunctions[cleaner](calculations[0]);
        }

        if (!invokedByParse) {
            if (this._filler.length > 1) {
                this._filler.unshift(this._filler.pop());
            }

            carryFiller = this._filler.length === 1 ?
                this._filler[0] :
                this._filler;

            this._filler = [];
        }

        return {
            calculations,
            input: query.hasOwnProperty('toString') ?
                query.toString() :
                query,
            result: calculations[0],
            rolled: carryFiller
        };
    }
}, {
    // Static properties and methods
    _regex: /^(\d*)d(\d+|%)(([+\-/*bw])(\d+))?(([+\-/*])(\d+|(\d*)d(\d+|%)(([+\-/*bw])(\d+))?))*$/,

    validate (diceString) {
        return DiceTower._regex.test(diceString);
    }
});

export default DiceTower;