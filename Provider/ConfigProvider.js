'use-strict';

const path = require('path'),
    Provider = require('./Provider');

module.exports = class ConfigProvider extends Provider {
    initialize(next) {
        const configLoaderInstance = require('../Config/Config.loader');
        configLoaderInstance.getConfig().then(config => {
            const Config = require('../Config/Config')
            const configSingleton = new Config(config);
            this.container.registerSingleton('config', configSingleton);
            next();
        }).catch(e => {
            console.error(e);
            throw e;
        });
    }
}
