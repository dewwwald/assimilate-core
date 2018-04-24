const { readdir, readdirSync } = require('fs'),
    { resolve } = require('path');

'use-strict';

const Provider = require('../Provider/Provider'),
    { EventEmitter } = require('events'),
    JobsCreator = require('./JobCreator'),
    JobTest = require('./JobTest');

module.exports = class JobsProvider extends Provider {
    initialize(next) {
        const config = this.container.make('config');
        const eventEmitter = new EventEmitter();
        const jobsCreator = new JobsCreator(eventEmitter, this.container, config)
        this.container.registerSingleton('Jobs/Creator', jobsCreator);
        this.container.registerSingleton('Jobs/Emitter', eventEmitter);

        if (config.get('environment') === 'test') {
            const testEmitter = new EventEmitter();
            const jobTest = new JobTest(testEmitter, this.container, config);
            this.container.registerSingleton('Jobs/TestAgent', jobTest);
            this.container.registerSingleton('Jobs/TestEmitter', testEmitter);
        }
        readdirSync(resolve('./Jobs')).forEach((item) => {
            const Job = require(resolve(`./Jobs/${item}`));
            new Job(eventEmitter, this.container, config);
        });
        next();
    }
}
