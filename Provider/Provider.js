'use-strict';

module.exports = class Provider {
    /**
     * @var Container@epitome-core/Container
     */
    get container() {
        return this._container;
    }
    set container(value) {
        Object.defineProperty(this, '_container', {
            writable: false, value: value
        });
    }

    constructor(container) {
        this.container = container;
    }

    /**
     * Initializes the service provider, callback must be called
     * @param function next() {}
     */
    initialize(next) {
        next();
    }

    /**
     * Step 1 registers the service provider
     */
    register() { }

    /**
     * Step 3 finalizes the service provider 
     */
    final() { }
}