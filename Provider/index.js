'use-strict';

const Provider = require('./Provider'),
    ProviderExtensions = require('./ProviderExtensions'),
    ProviderManager = require('./ProviderManager'), {
        AppProvider,
        MiddlewareProvider,
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
