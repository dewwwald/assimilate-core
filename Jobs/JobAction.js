'use-strict';

module.exports = class JobAction {
    /**
     * Event name that will trigger job execute
     */
    get eventName() { return undefined; }

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

    /**
     * set jobs emitter
     */
    set emitter(value) {
        if (this._emitter) {
            throw new Error('No! Don\'t set the Jobs emitter manually');
        }
        this._emitter = value;
    }

    /**
     * Function that runs when event fires
     */
    execute(state, complete, fail) {
        complete();
    }

    /**
     * Function that runs when event fails
     * Does logging and other work
     */
    failed(error, state) {
        if (this.config.get('environment') === 'production') {
            console.error(e);
        } else {
            throw e;
        }
    }

    constructor(eventEmitter, container, config) {
        this.emitter = eventEmitter;
        this.container = container;
        this.config = config;
        this.environment = this.config.get('environment');
        this.emitter.on(this.eventName, state => this._handleEvent(state));
        if (this.environment === 'test') {
            this.testAgent = this.container.make('Jobs/TestAgent');
        }

    }

    /**
     * Job success handler
     * @param {*} state
     */
    _handleSuccess(state) {
        if (this.environment === 'test') {
            this.testAgent.success(this.eventName, state);
        }
    }

    /**
     * Internal Job fail handler
     * @param Error error
     * @param {*} state
     */
    _handleFailed(error, state) {
        if (this.environment === 'test') {
            this.testAgent.fail(error, this.eventName, state);
        }
        this.failed(error, state);
    }

    /**
     * Event handler callback
     * @param {*} state
     */
    _handleEvent(state) {
        const { success, fail } = this._callbackFactory(state);
        try {
            this.execute(state, success, fail);
        } catch (error) {
            fail(error);
        }
    }

    /**
     * Creates callbacks for test purposes and other internal hooking
     * @param {*} state
     * @returns {success: @function, fail: @function(reason)} enclosure
     */
    _callbackFactory(state) {
        return {
            success: () => this._handleSuccess(state),
            fail: e => this._handleFailed(e, state)
        };
    }
}
