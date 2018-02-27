module.exports = class Immutable {
    /**
     * Consumes a list of objects and make a new shallow assigned object
     * @param {*} _object
     * @returns null
     */
    deepFreeze(_object) {
        if (!Object.isFrozen(_object)) {
            Object.freeze(_object);
        }
        Object.keys(_object).forEach(_propName => {
            if (_object.hasOwnProperty(_propName)
            && typeof _object[_propName] === 'object'
            && !Object.isFrozen(_object[_propName])) {
                this.deepFreeze(_object[_propName]);
            }
        });
    }

    /**
     * Consumes a list of objects and make a new shallow assigned immutable object
     * @param {*} _objects
     * @returns {}
     */
    createFrozen(..._objects) {
        const frozenObject = Object.assign.apply(null, [{}, ..._objects]);
        this.deepFreeze(frozenObject);
        return frozenObject;
    }
}