const { readdir, readdirSync } = require('fs'),
    { resolve } = require('path');

'use-strict';

const Provider = require('../Provider/Provider'),
    { EventEmitter } = require('events'),
    JobsCreator = require('./JobCreator');

module.exports = class JobsProvider extends Provider {
    initialize(next) {
        const eventEmitter = new EventEmitter();
        const jobsCreator = new JobsCreator(eventEmitter, this.container)
        this.container.registerSingleton('Jobs/Creator', jobsCreator);
        this.container.registerSingleton('Jobs/Emitter', eventEmitter);
        readdirSync(resolve('./Jobs')).forEach((item) => {
            const Job = require(resolve(`./Jobs/${item}`));
            new Job(eventEmitter, this.container);
        });
        next();
    }
}
