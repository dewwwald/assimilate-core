'use-strict';

const { ProviderManager } = require('./Provider');
const { Container } = require('./Container');

module.exports = function boot() {
    require('dotenv').config();
    
    const container = new Container();
    const providerManager = new ProviderManager(container);


    if (process.env.ENVIRONMENT === 'test') {
        // this is just a hack to keep mocha running long enough to load all the tests
        describe('Test framework database:', () => {
            it('drops before testing: ', function (done) {
                // this feels hackie but, it works 
                providerManager.lifeCycle.on('initialized', () => {
                    setTimeout(done, 50);
                });
            });

        });
    }

    const { ModelsProvider, DatabaseProvider } = require('./Database'),
        {RouterProvider} = require('./Routing'),
        {StorageProvider} = require('./Storage'),
        {ConfigProvider} = require('./Config'), {
            AppProvider,
            MiddlewareProvider,
            ProviderExtensions,
            TestProvider,
            SeederProvider,
        } = require('./Provider');

    providerManager.loadProviders([
        ConfigProvider,
        AppProvider,
        DatabaseProvider,
        MiddlewareProvider,
        ModelsProvider,
        ...ProviderExtensions.get(),
        RouterProvider,
        StorageProvider,
        SeederProvider,
        TestProvider,
    ]);
    
}
