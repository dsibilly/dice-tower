import _Error from 'isotropic-error';
import _make from 'isotropic-make';

const _InvalidTransformError = _make(_Error, {
    _init (transform) {
        this.name = 'InvalidTransformError';

        if (!transform) {
            this.message = 'Invalid transform implied, but no transform found.';

            return this;
        }

        this.details = {
            type: typeof transform
        };

        this.message = `Transforms of type ${this.details.type} are not a valid for node-roll.`;

        return this;
    }
});

export default _InvalidTransformError;
