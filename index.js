'use-strict';

const Immutable = require('./Lib/Immutable'),
    FacadeProvider = require('./Lib/FacadeProvider'),
    { Provider } = require('./Provider'),
    boot = require('./bootstrap'),
    pipeline = require('./Lib/pipeline'),
    defined = require('./Lib/defined'),
    CoreDatabase = require('./Database');
    // Storage = require('./Storage');

module.exports = {
    ...CoreDatabase,
    Immutable,
    FacadeProvider,
    boot,
    pipeline,
    defined,
    Provider,
    // Storage
};
