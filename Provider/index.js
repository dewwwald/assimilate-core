'use-strict';

const Provider = require('./Provider'),
    ProviderManager = require('./ProviderManager'), {
        AppProvider,
        MiddlewareProvider,
        ProviderExtensions,
        TestProvider,
        SeederProvider,
    } = require('./Core');

module.exports = {
    AppProvider,
    MiddlewareProvider,
    ProviderExtensions,
    TestProvider,
    SeederProvider,
    ProviderManager,
    Provider
}
