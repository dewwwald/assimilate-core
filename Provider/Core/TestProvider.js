'use-strict';

const Provider = require('../Provider'),
    fs = require('fs'),
    path = require('path'),
    request = require('supertest');

module.exports = class TestProvider extends Provider {
    register() {
        this.config = this.container.make('config');
        if (this.config.get('environment') === 'test') {
            this.container.registerSingleton('test/agent', request(this.container.make('app')));
            this.container.registerSingleton('test/agent_two', request(this.container.make('app')));            this.testFileExt = this.config.get('Test.testExtension') || 'test.js';
            this.container.registerSingleton('test/agent_three', request(this.container.make('app')));
            const testAbles = this.config.get('Test.testAbles');
            if (testAbles.length > 0) {
                this._loadTests(testAbles);
            }
        }
    }

    _handleDirStatData(fsStats, testAble) {
        const self = this;
        return new Promise((resolve, reject) => {
            const checkFilenameRegExp = new RegExp(self.testFileExt + '$');
            if (fsStats.length > 0) {
                fsStats.forEach(function (filename) {
                    if (checkFilenameRegExp.test(filename)) {
                        const testSuite = require(path.resolve(`./${testAble}/${filename}`));
                        testSuite(self.container);
                    }
                });
                resolve();
            } else {
                resolve();
            }
        });
    }

    _loadTests(testAbles) {
        let counter = 0;
        testAbles.forEach(testAble => {
            const fsStats = fs.readdirSync(path.resolve(`./${testAble}`))
            this._handleDirStatData(fsStats, testAble).catch(e => {
                console.error(e);
                throw e;
            });
        });
    }
}
