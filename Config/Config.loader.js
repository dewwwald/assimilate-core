const path = require('path'), 
    fs = require('fs'),
    { Immutable, defined } = require('../');

class ConfigLoader {

    getConfig() {
        return new Promise(this._loaderMiddleWare);
    }

    constructor(immutable) {
        this.immutable = immutable;
        this._loadConfig = this._loadConfig.bind(this);
        this._loaderMiddleWare = this._loaderMiddleWare.bind(this);
    }

    _resolveConfigFiles(filenameList) {
        const config = {};
        filenameList.forEach(filename => {
            const namespace = filename.split('.')[0];
            config[namespace] = require(path.resolve('./Config/' + filename));
        });
        return config;
    }

    _handleConfigFileList(err, filenameList, resolve, reject) {
        if (err) {
            reject(err);
            return;
        }
        this._setConfig(this._resolveConfigFiles(filenameList));
        resolve(this.config);
    }

    _loadConfig(resolve, reject) {    
        fs.readdir(
            path.resolve('./Config/'), 
            (error, filenameList) => this._handleConfigFileList
                .apply(this, [error, filenameList, ...arguments]));
    }

    _setConfig(value) {
        const config = this.immutable.createFrozen(value);
        Object.defineProperty(this, "config", {
            writable: false, enumerable: true, configurable: true, value: config
        });
    }

    _loadingSuccess(data, resolve, reject) {
        resolve(this.config);
    }

    _loadingError(error, resolve, reject) {
        // add an error handler for logging and notification
        console.error(error);
        reject(error);
    }

    _loaderMiddleWare(resolve, reject) {
        if (defined(this.config)) {
            resolve(this.config);
        } else if(!defined(this.configLoader)) {
            this.configLoader = new Promise(this._loadConfig);
            this.configLoader.then(val => this._loadingSuccess.apply(this, [val, ...arguments])) 
                .catch(error => this._loadingError.apply(this, [error, ...arguments]));
        } else {
            this.configLoader.then(resolve).catch(reject);
        }
    }
}

module.exports = new ConfigLoader(new Immutable());