'use-strict';

const multer = require('multer');
const fs = require('fs');
const isJpg = new RegExp('jpe?g$', 'gi');
const mkDirFromRootSync = require('../../Lib/mkDirFromRootSync');
const { MEMORY_STORAGE, LOCAL_STORAGE } = require('./enums');

module.exports = class LocalStorage {
    get store() { return this._store; }
    set store(value) { this._store = value; }

    get config() { return this._config; }
    set config(value) { this._config = value; }

    localStorageDestination(req, file, cb) {
        mkDirFromRootSync(`${this.root}`, this._todaysLocation());
        cb(null, this._createRootFolder());
    }

    localStorageFilename(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `${req.headers.slug || file.filename}`;
        if (isJpg.test(ext)) {
            cb(null, isJpg.test(filename) ? filename : this._fileExistsSlugger(`${filename}.${ext}`));
        } else {
            const extRegExp = new RegExp(`${ext}$`);
            cb(null, extRegExp.test(filename) ? filename : this._fileExistsSlugger(`${filename}.${ext}`));
        }
    }

    constructor(config) {
        this.config = config;
        this.root = `${process.cwd()}/storage/app/${this.config.module}`;
        this.localStorageDestination = this.localStorageDestination.bind(this);
        this.localStorageFilename = this.localStorageFilename.bind(this);
        mkDirFromRootSync(process.cwd(), `/storage/app/${this.config.module}`);
        this.store = this.createStore();
    }

    createStore() {
        switch (this.config.provider) {
            case LOCAL_STORAGE:
                return multer.diskStorage({
                    destination: this.localStorageDestination,
                    filename: this.localStorageFilename
                });
            case MEMORY_STORAGE:
            default:
                return multer.memoryStorage();
        }
    }

    _fileExistsSlugger(fileName) {
        const filePath = this._createRootFolder() + fileName;
        if (fs.existsSync(filePath)) {
            const array = fileName.split('.');
            array[array.length - 2] = this._appendRandom5(`${array[array.length - 2]}-`);
            return array.join('.');
        }

        return fileName;
    }

    /**
     * Append 5 random characters
     * @param string value
     * @param number index
     * @return string
     */
    _appendRandom5(value, index = 0) {
        const char = this._getRandomAlphaNumericChar();
        value += char;
        if (index < 4) {
            return this._appendRandom5(value, index + 1);
        } else {
            return value;
        }
    }

    /**
     * Creates and returns a single random alphanumeric char
     * @returns string;
     */
    _getRandomAlphaNumericChar() {
        const random = Math.random();
        if (random < .33) {
            return String.fromCharCode(97 + Math.round(25 * Math.random()));
        } else if (random < .67) {
            return String.fromCharCode(65 + Math.round(25 * Math.random()));
        } else {
            return Math.round(9 * Math.random()).toString();
        }
    }

    _createRootFolder() {
        return `${this.root}/${this._todaysLocation()}/`;
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

