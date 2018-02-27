function setupContainer() {
    const { Container } = require('./Container');
    const container = new Container();
    return container;
}

module.exports = function boot() {
    require('dotenv').config();
    const { ProviderManager, CoreProviders } = require('./Provider');
    const container = setupContainer();
    const providerManager = new ProviderManager(container);
    providerManager.loadProviders([
        ...CoreProviders
    ]);
}
