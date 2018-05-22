'use-strict';

module.exports = class JobTest {
    /**
     * App Container
     */
    get container() { return this._container; }
    set container(value) { this._container = value; }

    /**
     * App Config
     */
    get config() { return this._config; }
    set config(value) { this._config = value; }

    /**
     * get jobs emitter
     */
    get emitter() {
        return this._emitter;
    }

    get deferred() { return this._deferred || {}; }
    set deferred(value) { this._deferred = value; }

    get deferredCallbacks() { return this._deferredCallbacks || {}; }
    set deferredCallbacks(value) { this._deferredCallbacks = value; }

    /**
     * set jobs emitter
     */
    set emitter(value) {
        if (this._emitter) {
            throw new Error('No! Don\'t set the Jobs emitter manually');
        }
        this._emitter = value;
    }

    constructor(eventEmitter, container, config) {
        this.emitter = eventEmitter;
        this.container = container;
        this.config = config;
    }

    defer(eventName) {
        if (this.deferredCallbacks[eventName]) {
            this.emitter.on(eventName, this.deferredCallbacks[eventName]);
        } else {
            this.deferredCallbacks[eventName] = this._handleDeferredCallback.bind(this, eventName);
        }
    }

    success(eventName, state) {
        this.emitter.emit(eventName, state);
    }

    fail(error, eventName, state) {
        this.emitter.emit('error', new Error(`created by app failed, ${eventName},
            \nState:\n${JSON.stringify(state.serialize ? state.serialize() : state)}
            \nError: \n${error.message}`));
    }


    on(eventName, callback) {
        const state = this.deferred[eventName];
        if (state) {
            callback(state);
        } else {
            this.emitter.on(eventName, callback);
        }
        if (this.deferredCallbacks[eventName]) {
            this.emitter.removeListener(eventName, this.deferredCallbacks[eventName]);
        }
        delete this.deferred[eventName];
    }

    _handleDeferredCallback(eventName, state) {
        this.deferred[eventName] = state;
    }
}
