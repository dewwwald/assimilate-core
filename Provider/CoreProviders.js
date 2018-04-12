'use-strict';

const ConfigProvider = require('./ConfigProvider'),
    AppProvider = require('./AppProvider'),
    DatabaseProvider = require('./DatabaseProvider'),
    MiddlewareProvider = require('./MiddlewareProvider'),
    ModelsProvider = require('./ModelsProvider'),
    RouterProvider = require('./RouterProvider'),
    ProviderExtensions = require('./ProviderExtensions'),
    TestProvider = require('./TestProvider'),
    SeederProvider = require('./SeederProvider');

module.exports = [
    ConfigProvider,
    AppProvider,
    DatabaseProvider,
    MiddlewareProvider,
    ModelsProvider,
    ...ProviderExtensions.get(),
    RouterProvider,
    SeederProvider,
    TestProvider,
];
