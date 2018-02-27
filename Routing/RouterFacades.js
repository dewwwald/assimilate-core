const path = require('path'),
    { FacadeProvider } = require(path.resolve('./Core')),
    Router = require('./Router');

module.exports = class RouterFacades extends FacadeProvider {
    constructor(...args) {
        super(Router, ...args);
    }
}