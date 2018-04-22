'use-strict';

const Router = require('./Router'),
    RouterProvider = require('./RouterProvider'),
    RouterLoader = require('./Router.loader'),
    RouterFacades = require('./RouterFacades'),
    constants = require('./Router.contants');

module.exports = {
    RouterProvider,
    RouterLoader,
    RouterFacades,
    Router,
    ...constants
};
