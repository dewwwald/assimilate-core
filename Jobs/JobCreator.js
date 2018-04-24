'use-strict';

module.exports = class JobCreator {

    constructor(eventEmitter, container) {
        this.emitter = eventEmitter;
        this.container = container;
    }

    /**
     * Creates a job to emit now
     */
    dispatch(action, state = {}) {
        this.emitter.emit(action, state);
    }

    /**
     * Create a job to run later
     */
    schedule() {}
}
