const EventEmitter = require('events');

'use-strict';

module.exports = class ProviderManager {
    get container() {
        return this._container;
    }

    set container(value) {
        Object.defineProperty(this, '_container', {
            writable: false, value: value
        });
    }

    get registers() {
        return this._registers || [];
    }

    set registers(value) {
        this._registers = value;
    }

    get finalizers() {
        return this._finalizers || [];
    }

    set finalizers(value) {
        this._finalizers = value;
    }

    get lifeCycle() {
        if (!this._lifeCycle) {
            this.lifeCycle = new EventEmitter();
        }
        return this._lifeCycle;
    }

    set lifeCycle(eventEmitter) {
        this._lifeCycle = eventEmitter;
    }

    loadProviders(providersList) {
        providersList = providersList.map(Provider => new Provider(this.container));
        this._recurseProviderInitialize(providersList);
    }

    constructor(container) {
        this.container = container;
    }

    _initializeWrapper(providerInstance) {
        return new Promise((resolve, reject) => {
            try {
                providerInstance.initialize(this._initializerCallback.bind(this, providerInstance, resolve, reject));
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    _registerAndFinalize() {
        this.registers.forEach(register => {
            register();
        });

        this.finalizers.forEach(finalizers => {
            finalizers();
        });
    }

    _initializerCallback(providerInstance, resolve, reject, ...value) {
        try {
            this.registers = [...this.registers, providerInstance.register.bind(providerInstance, ...value)];
            this.finalizers = [...this.finalizers, providerInstance.final.bind(providerInstance)];
            resolve();
        } catch (e) {
            reject(e);
        }
    }

    _recurseProviderInitialize([provider, ...providersList]) {
        if (provider) {
            this._initializeWrapper(provider).then(() => {
                this._recurseProviderInitialize(providersList);
            }).catch(e => {
                console.error(e);
                throw new Error(e);
            });
        } else {
            this.lifeCycle.emit('initialized');
            this._registerAndFinalize();
        }
    }

}
