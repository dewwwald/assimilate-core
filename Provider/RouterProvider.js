const express = require('express'),
    Provider = require('./Provider'),
    path = require('path');

module.exports = class RouterProvider extends Provider {
    register() {
        const { RouterLoader, RouterFacades } = require('../Routing');
        const routeExtension = this.container.make('config').get('App.routeExt');
        (new RouterLoader(this.container, express.Router)).loadRoutes();
        const router = new RouterFacades(this.container, null);
        this.container.registerSingleton('router', router);
    }
}
