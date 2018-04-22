'use-strict';

const Provider = require('../Provider'),
    express = require('express'),
    bodyparser = require('body-parser');

module.exports = class MiddlewareProvider extends Provider {
    initialize(next) {
        const app = this.container.make('app');
        app.use(bodyparser.urlencoded({ extended: true }));
        app.use(bodyparser.json());
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
