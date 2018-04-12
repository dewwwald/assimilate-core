'use-strict';

function setupContainer() {
    const { Container } = require('./Container');
    const container = new Container();
    return container;
}

module.exports = function boot() {
    require('dotenv').config();
    const { ProviderManager } = require('./Provider');
    const CoreProviders = require('./Provider/CoreProviders');
    const container = setupContainer();
    if (process.env.ENVIRONMENT === 'test') {
        // this is just a hack to keep mocha running long enough to load all the tests
        describe('Test framework:', () => {
            before(function (done) {
                setTimeout(done, 50);
            });
            
            it('Successfully loaded tests...', () => {});
        });
    }
    const providerManager = new ProviderManager(container);
    providerManager.loadProviders([
        ...CoreProviders
    ]);
    
}
