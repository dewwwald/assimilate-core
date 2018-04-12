const defined = require('../Lib/defined');

module.exports = class Container {
    registerSingleton(key, singleton) {
        if (typeof singleton === 'function') {
            this._addSingletonCreator(key, singleton);
        } else if (typeof singleton === 'object') {
            this._addSingleton(key, singleton);
        } else {
            throw new Error('Container: creating singletons need to be a creator function or a instance');
        }
    }

    register(key, creator) {
        this._addCreator(key, creator);
    }
    
    make(key, args = [], soft = false) {
        try {
            const singleton = this.singletons[key];
            if (defined(singleton)) {
                return singleton;
            } else {
                return this._runCreator(key, args.length ? args : [ args ]);
            }
        } catch (e) {
            if (soft) {
                return undefined
            } else {
                console.error(key + ': could not be created');
                throw e;
            }
        }
    }

    constructor() {
        this.singletons = {};
        this.creators = {};
    }

    _createInstance(CreatorObject, args) {
        try {
            return CreatorObject(...args);
        } catch (e) {
            return new CreatorObject(...args);
        }
    }

    _runCreator(key, args = []) {
        const CreatorObject = this.creators[key];
        try {
            return this._createInstance(CreatorObject, args);
        } catch (e) {
            console.error(e);
        }
    }
    
    _getSingletonThroughCreator(key, creator) {
        if (!defined(this.singletons['container_creator_' + key])) {
            this._addSingleton('container_creator_' + key, this._runCreator(key));
        }
        return this.singletons['container_creator_' + key];
    }

    _addSingleton(key, singleton) {
        Object.defineProperty(this.singletons, key, {
            writable: false, enumerable: true, configurable: true, value: singleton
        });
    }

    _addCreator(key, creator) {
        Object.defineProperty(this.creators, key, {
            writable: false, 
            enumerable: true, 
            configurable: true, 
            value: creator
        });
    }

    _addSingletonCreator(key, creator) {
        Object.defineProperty(this.singletons, key, {
            get: this._getSingletonThroughCreator.bind(this, key)
        });
        this._addCreator(key, creator);
    }
}