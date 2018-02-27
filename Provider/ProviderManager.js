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

    _recurseProviderInitialize(providersList) {
        const provider = providersList[0],
            nextProviderList = providersList.slice(1),
            _this = this;

        this._initializeWrapper(provider)
        .then(() => {
            if (nextProviderList.length > 0) {
                _this._recurseProviderInitialize(nextProviderList);
            } else {
                _this._registerAndFinalize();
            }
        })
        .catch(e => {
            console.error(e);
            throw new Error(e);
        });
    }


}
