'use-strict';

const multer = require('multer');
const { DATA } = require('../Routing/Router.contants');
const {
    MEMORY_STORAGE, LOCAL_STORAGE, AWS_S3_STORAGE, AwsS3Storage, LocalStorage
} = require('./MiddlewareStores');

/**
 * Promise based Storage wrapper for the different storage strategies
 */
module.exports = class StorageMiddleware {
    get config() { return this._config; }
    set config(value) { this._config = value; }

    get multer() { return this._multer; }
    set multer(value) { this._multer = value; }

    get multerMiddleware() { return this._multerMiddleware; }
    set multerMiddleware(value) { this._multerMiddleware = value; }

    get providerList() {
        return [ MEMORY_STORAGE, LOCAL_STORAGE, AWS_S3_STORAGE ];
    }

    get() {
        if (!this.multer) this._setupMulter();
        if (!this.multerMiddleware) this.multerMiddleware = this._createMiddleware();
        return this.middlewareWrapperFunction;
    }

    middlewareWrapperFunction(request, response, next) {
        this.multerMiddleware(request, response, (error) => {
            this.middlewareWrapperCallback(error).then(() => {
                response.locals[DATA] = request.body;
                const cwd = process.cwd();
                request.file.appLocation = request.file.destination.replace(cwd, '');
                request.file.uri = request.file.path.replace(`${cwd}/storage/app`, '');
                next();
            });
        });
    }

    middlewareWrapperCallback(error) {
        return new Promise((resolve, reject) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    }

    constructor(storageConfig) {
        this.config = storageConfig;
        this.middlewareWrapperFunction = this.middlewareWrapperFunction.bind(this);
        this.middlewareWrapperCallback = this.middlewareWrapperCallback.bind(this);
    }

    _createMiddleware() {
        const { allow, fieldName, fieldList, maxCount = 1 } = this.config;
        if (allow === 'all') {
            console.warn(`WARNING: Uploading very large files, or relatively small
                files in large numbers very quickly, can cause your application to
                run out of memory when memory storage is used.`);
            return this.multer.any();
        }
        if (allow === 'none') return this.multer.none();
        if (fieldName && maxCount === 1) {
            return this.multer.single(fieldName);
        } else if (fieldName && maxCount) {
            return this.multer.array(fieldName, maxCount);
        } else if (fieldList) {
            return this.multer.fields(fieldList);
        }
        console.warn(`
            No file upload configuration did not specify a middleware,
            no action will be taken`);
        return this.multer.none()
    }

    _createMiddlewareStorage() {
        switch (this.config.provider) {
            case AWS_S3_STORAGE:
                return new AwsS3Storage(this.config);
            case LOCAL_STORAGE:
                return new LocalStorage(this.config);
            case MEMORY_STORAGE:
                return new LocalStorage(this.config);
            default:
                throw new Error(`
                    No provider for that storage unit ${this.config.provider},
                    configure provider property in config.Storage,
                    with one of these values ${this.providerList}`);
        }
    }

    _setupMulter() {
        this.multer = multer({
            storage: this._createMiddlewareStorage()
        });
    }
};
