'use-strict';

const multer = require('multer');
const fs = require('fs');
const mkDirFromRootSync = require('../../Lib/mkDirFromRootSync');
const { MEMORY_STORAGE, LOCAL_STORAGE } = require('./enums');

module.exports = class LocalStorage {
    get store() { return this._store; }
    set store(value) { this._store = value; }

    get config() { return this._config; }
    set config(value) { this._config = value; }

    localStorageDestination(req, file, cb) {
        mkDirFromRootSync(`${process.cwd()}/${this.root}`, this._todaysLocation());
        cb(null, `${this.root}/${this._todaysLocation()}/`);
    }

    localStorageFilename(req, file, cb) {
        cb(null, `${req.headers.slug || file.filename}`);
    }

    constructor(config) {
        this.config = config;
        this.root = `${process.cwd()}/storage/app/${this.config.module}`;
        this.store = this.createStore();
        mkDirFromRootSync(process.cwd(), `/storage/app/${this.config.module}`);
    }

    createStore() {
        switch (this.config.provider) {
            case LOCAL_STORAGE:
                return multer.diskStorage({
                    destination: this.localStorageDestination.bind(this),
                    filename: this.localStorageFilename.bind(this)
                });
            case MEMORY_STORAGE:
            default:
                return multer.memoryStorage();
        }
    }

    _todaysLocation() {
        const date = new Date();
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }

    _removeFile(...args) {
        this.store._removeFile(...args);
    }

    _handleFile(...args) {
        this.store._handleFile(...args);
    }
}

