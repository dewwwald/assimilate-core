module.exports = class Provider {
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

    initialize(next) {
        next();
    }

    register() { }

    final() { }
}