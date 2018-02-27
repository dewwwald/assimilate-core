module.exports = class Config {
    constructor(config) {
        this.config = config;
    }

    get(dotNotation) {
        return dotNotation.split('.').reduce(
            (config, key) => config[key], this.config);
    }
}