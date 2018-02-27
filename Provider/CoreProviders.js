const ConfigProvider = require('./ConfigProvider'),
    AppProvider = require('./AppProvider'),
    DatabaseProvider = require('./DatabaseProvider'),
    MiddlewareProvider = require('./MiddlewareProvider'),
    ModelsProvider = require('./ModelsProvider'),
    RouterProvider = require('./RouterProvider'),
    ExtensionProvider = require('./ExtensionProvider');

module.exports = [
    ConfigProvider,
    AppProvider,
    DatabaseProvider,
    MiddlewareProvider,
    ModelsProvider,
    RouterProvider,
    ExtensionProvider
];
