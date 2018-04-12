'use-strict';

const Provider = require('./Provider');

module.exports = class DatabaseProvider extends Provider {
    register() {
        const { Database } = require('../Database');
        const config = this.container.make('config');
        const database = new Database(config.get('Database'), config.get('App.modelExt'));
        this.container.registerSingleton('database', database);
    }
}
