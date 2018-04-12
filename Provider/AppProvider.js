'use-strict';

const express = require('express'),
    Provider = require('./Provider');

module.exports = class AppProvider extends Provider {
    register() {
        this.container.registerSingleton('app', express);
    }

    final() {
        const app = this.container.make('app');
        const config = this.container.make('config');
        const port = config.get('App.port');
        app.listen(port, function () {
            console.info('Running on localhost:' + port);
        });
    }
}
