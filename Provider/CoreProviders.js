const ConfigProvider = require('./ConfigProvider'),
    AppProvider = require('./AppProvider'),
    DatabaseProvider = require('./DatabaseProvider'),
    MiddlewareProvider = require('./MiddlewareProvider'),
    ModelsProvider = require('./ModelsProvider'),
    RouterProvider = require('./RouterProvider'),
    ExtensionProvider = require('./ExtensionProvider'),
    TestProvider = require('./TestProvider'),
    SeederProvider = require('./SeederProvider');

module.exports = [
    ConfigProvider,
    AppProvider,
    DatabaseProvider,
    MiddlewareProvider,
    ModelsProvider,
    ExtensionProvider,
    RouterProvider,
    SeederProvider,
    TestProvider,
];
