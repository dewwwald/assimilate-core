'use-strict';

const Router = require('./Router'),
    RouterLoader = require('./Router.loader'),
    RouterFacades = require('./RouterFacades'),
    constants = require('./Router.contants');
    
module.exports = {
    RouterLoader,
    RouterFacades,
    Router,
    ...constants
};