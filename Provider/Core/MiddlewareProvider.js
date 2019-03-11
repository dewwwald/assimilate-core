'use-strict';

const Provider = require('../Provider'),
    express = require('express'),
    bodyparser = require('body-parser');

module.exports = class MiddlewareProvider extends Provider {
    initialize(next) {
        const app = this.container.make('app');
        const config = this.container.make('config');
        app.use(bodyparser.urlencoded({
            extended: true,
            limit: config.get('Storage.limits.fieldSize', 1024 * 1024 * 8)
        }));
        app.use(bodyparser.json({
            limit: config.get('Storage.limits.fieldSize', 1024 * 1024 * 8)
        }));
        next();
    }

    final() {
        const app = this.container.make('app');
        const config = this.container.make('config');
        if (config.get('App.servePublicFolder')) {
            app.use(express.static('Public', {}));
        }
    }
}
