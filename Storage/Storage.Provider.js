'use-strict';

const Storage = require('./Storage');
const Provider = require('../Provider/Provider'),
    express = require('express'),
    path = require('path'),
    fs = require('fs');

module.exports = class StorageProvider extends Provider {
    get storageConfig() { return this._storageConfig; }
    set storageConfig(value) { this._storageConfig = value; }

    initialize(next) {
        this.config = this.container.make('config');
        const storageConfig = this.config.get('Storage');
        this.storageConfig = storageConfig;
        storageConfig.forEach(config => {
            const storage = new Storage(config);
            this.container.registerSingleton('Storage/' + config.module, storage);
        });
        next();
    }

    register() {
    }

    final() {
        const app = this.container.make('app');
        this.storageConfig.forEach(config => {
            if (config.serve) {
                app.use(`/${config.module}`,
                    express.static(`public/${config.module}`));
            }
        });
    }
}
