'use-strict';

const multer = require('multer');

module.exports = class AwsS3Storage {
    get store() { return this._store; }
    set store(value) { this._store = value; }

    get config() { return this._config; }
    set config(value) { this._config = value; }

    constructor(config) {
        this.config = config;
        this.root = `${process.cwd()}/storage/app/${this.config.module}`;
        this.store = multer({
            storage: {}
        });
    }

    _removeFile(...args) {
        this.store._removeFile(...args);
    }

    _handleFile(...args) {
        this.store._handleFile(...args);
    }
}
