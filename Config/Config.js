'use-strict';

module.exports = class Config {
    constructor(config) {
        this.config = config;
    }

    get(dotNotation, defaultValue = undefined) {
        return dotNotation.split('.').reduce(
            (config, key) => typeof config !== 'undefined' && config[key]
                ? config[key]
                : defaultValue, this.config);
    }
}
