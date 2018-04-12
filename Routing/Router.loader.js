'use-strict';

const path = require('path'), 
    fs = require('fs'),
    Router = require('./Router'),
    constants = require('./Router.contants'),
    { DATA } = constants;

module.exports = class RouterLoader {
    get routeExtension() { return this._routeExtension; }

    get container() { return this._container; }
    
    get ExpressRouter() { return this._expressRouter; }

    loadRoutes() {
        this._configureParamNameDataMiddleware();
        try {
            const config = this.container.make('config');
            const filenameList = fs.readdirSync(path.resolve('./Routing'));
            filenameList.forEach(filename => {
                if (filename.indexOf(this.routeExtension) > -1) {
                    const NamespacedRouter = require(path.resolve('./Routing/' + filename));
                    const routeNamespace = NamespacedRouter.namespace || filename.replace(this.routeExtension, '').toLowerCase();
                    const expressRouter = new this.ExpressRouter();
                    const router = new Router(this.container, expressRouter);
                    new NamespacedRouter(router);
                    this.container.make('app').use('/' + routeNamespace, expressRouter);
                }
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    
    constructor(container, ExpressRouter) {
        this._routeExtension = container.make('config').get('App.routeExt');
        this._container = container;
        this._expressRouter = ExpressRouter;
    }

    _configureParamNameDataMiddleware() {
        const app = this.container.make('app');
        app.post('*', this._handleDataParam.bind(this));
        app.put('*', this._handleDataParam.bind(this));
        app.patch('*', this._handleDataParam.bind(this));
    }

    _handleDataParam(request, response, next) {
        response.locals[DATA] = request.body;
        next();
    }
}