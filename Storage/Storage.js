'use-strict';

const StorageMiddleware = require('./Middleware');
const { MEMORY_STORAGE, LOCAL_STORAGE, AWS_S3_STORAGE } = require('./MiddlewareStores');

module.exports = class Storage {
    get config() { return this._config; }
    set config(value) { this._config = value; }

    get middleware() { return this._middleware; }
    set middleware(value) { this._middleware = value; }

    get providerList() {
        return [ MEMORY_STORAGE, LOCAL_STORAGE, AWS_S3_STORAGE ];
    }

    constructor(storageConfig) {
        this.config = storageConfig;
        const middleware = new StorageMiddleware(storageConfig);
        this.middleware = middleware;
    }


}
