'use-strict';

const Provider = require('../Provider'),
    bodyparser = require('body-parser');

module.exports = class MiddlewareProvider extends Provider {
    initialize(next) {
        const app = this.container.make('app');
        app.use(bodyparser.urlencoded({ extended: true }));
        app.use(bodyparser.json());
        next();
    }
}
