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
        storageConfig.units.forEach(config => {
            const storage = new Storage(config);
            this.container.registerSingleton('Storage/' + config.module, storage);
        });
        next();
    }

    register() {}

    final() {
        const app = this.container.make('app');
        this.storageConfig.serve.forEach(config => {
            const sym = path.resolve(`Public/${config.name}`);
            const target = path.resolve(config.src);
            if (!fs.existsSync(sym)) fs.symlinkSync(target, sym, 'dir');
        });
    }
}
