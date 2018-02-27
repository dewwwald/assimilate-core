const path = require('path'),
    FacadeProvider = require('../Lib/FacadeProvider'),
    Router = require('./Router');

module.exports = class RouterFacades extends FacadeProvider {
    constructor(...args) {
        super(Router, ...args);
    }
}