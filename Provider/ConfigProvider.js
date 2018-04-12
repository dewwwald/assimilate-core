'use-strict';

const path = require('path'),
    Provider = require('./Provider');

module.exports = class ConfigProvider extends Provider {
    initialize(next) {
        const configLoaderInstance = require('../Config/Config.loader');
        configLoaderInstance
        .getConfig()
        .then(config => {
            const Config = require('../Config/Config')
            next(new Config(config));
        })
        .catch(e => {
            console.error(e);
            throw e;
        });
    }

    register(configInstance) {
        this.container.registerSingleton('config', configInstance);
    }
}
