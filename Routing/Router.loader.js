const path = require('path'), 
    fs = require('fs'),
    Router = require('./Router'),
    constants = require('./Router.contants'),
    { DATA } = constants;

module.exports = class RouterLoader {
    get routeExtension() { return this._routeExtension; }

    get container() { return this._container; }
    
    get CoreRouter() { return this._coreRouter; }

    loadRoutes() {
        this._configureParamNameDataMiddleware();
        try {
            const config = this.container.make('config');
            const filenameList = fs.readdirSync(path.resolve('./Routing'));
            filenameList.forEach(filename => {
                if (filename.indexOf(this.routeExtension) > -1) {
                    const NamespacedRouter = require(path.resolve('./Routing/' + filename));
                    const routeNamespace = NamespacedRouter.namespace || filename.replace(this.routeExtension, '').toLowerCase();
                    const coreRouter = new this.CoreRouter();
                    const router = new Router(this.container, coreRouter);
                    new NamespacedRouter(router);
                    this.container.make('app').use('/' + routeNamespace, coreRouter);
                }
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    
    constructor(container, CoreRouter) {
        this._routeExtension = container.make('config').get('App.routeExt');
        this._container = container;
        this._coreRouter = CoreRouter;
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