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
     * get jobs emitter
     */
    get emitter() {
        return this._emitter;
    }

    /**
     * set jobs emitter
     */
    set emitter(value) {
        this._emitter = value;
    }

    /**
     * Function that runs when event fires
     */
    execute() {}

    /**
     * Function that runs when event fails
     */
    failed(error) {
        console.error(e);
    }

    constructor(eventEmitter, container) {
        this.emitter = eventEmitter;
        this.container = container;
        this._initialize();
    }

    _initialize() {
        this.emitter.on(this.eventName, this._handleEvent.bind(this));
    }

    _handleEvent(state) {
        try {
            this.execute(state);
        } catch (e) {
            this.failed(e, state);
        }
    }

}
