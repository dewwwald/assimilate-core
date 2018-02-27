const path = require('path'),
    { defined } = require(path.resolve('./Core')),
    constants = require('./Router.contants'),
    { DATA } = constants;

module.exports = class Router {
    /**
     * Used by facade provider to provide access to global methods
     */
    get facade() {
        return ['baseUrl', 'publicUrl']
    }

    /**
     * The core router of express that registers the app listen routes
     */
    get router() {
        return this._router;
    }

    /**
     * The App container
     */
    get container() {
        return this._container;
    }

    get app() {
        if (!defined(this._app)) {
            this._app = this.container.make('app');
        }
        return this._app;
    }

    get(path, connector) {
        const connectionFunction = this._getConnector(connector);
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        this.router
            .route(this._makePath(path))
            .get(this._wrapFunction.apply(null, [connectionFunction, ...args]));
        return this;
    }
    
    post(path, connector) {
        const connectionFunction = this._getConnector(connector);
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        this.router
            .route(this._makePath(path))
            .post(this._wrapFunction.apply(null, [connectionFunction, ...args, DATA]));
        return this;
    }
    
    put(path, connector) {
        const connectionFunction = this._getConnector(connector);
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        this.router
            .route(this._makePath(path))
            .put(this._wrapFunction.apply(null, [connectionFunction, ...args, DATA]));
        return this;
    }
    
    delete(path, connector) {
        const connectionFunction = this._getConnector(connector);
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        this.router
            .route(this._makePath(path))    
            .delete(this._wrapFunction.apply(null, [connectionFunction, ...args]));
        return this;
    }
    
    patch(path, connector) {
        const connectionFunction = this._getConnector(connector);
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        this.router.patch(
            this._makePath(path), 
            this._wrapFunction.apply(null, [connectionFunction, ...args, DATA]));
        return this;
    }

    baseUrl() {
        throw new Error('implement Router:baseUrl');
    }

    publicUrl() {
        throw new Error('implement Router:publicUrl');
    }

    constructor(container, router) {
        this._container = container;
        this._router = router;
    }
    
    _makePath(...args) {
        return args.reduce((pre, curr) => pre + '/' + curr, '').replace(new RegExp('[/]{1,3}'), '/');
    }

    _buildArgs(path) {
        const paramFinder = new RegExp(':([a-zA-Z]*)', 'g');
        const items = path.match(paramFinder) || [];
        return items.map(value => value.replace(':', ''));
    }

    _getConnectorClassFunction(containerName) {
        const routerConnectionName = new RegExp('([A-Z][A-Za-z]*)@([A-Za-z]*)');
        const matches = routerConnectionName.exec(containerName);
        const controllerExt = this.container.make('config').get('App.controllerExt');
        const Controller = require(path.resolve('./Controllers/' + matches[1] + controllerExt));
        const controllerInstance = new Controller(this.container);
        if (defined(controllerInstance[matches[2]])) {
            return controllerInstance[matches[2]].bind(controllerInstance);
        } else {
            throw new Error('Controller: ' + matches[1] + ' has no function named ' + matches[2]);
        }
    }

    _wrapFunction(connectionFunction, ...args) {
        return function (request, response) {
            let params = [];
            args.forEach(param => {
                params = [...params, (response.locals[param] || undefined)];
            });
            return connectionFunction.apply(null, [request, response, ...params]);
        }
    }

    _configureParamListMiddleware(args) {
        args.forEach(this._configureParamNameMiddleware.bind(this));
    }

    _configureParamNameMiddleware(param) {
        const tries = [param.charAt(0).toUpperCase() + param.substring(1), param];
        let i = 0, model = undefined;
        do {
            model = this.container.make('Model/' + tries[i], undefined, true);    
            i++;
        } while (i < tries.length && !defined(model)) 
        if (defined(model)) {
            this.router.param(param, this._handleKnownParamsModels.bind(this, param, model));
        }
    }

    _handleKnownParamsModels(current, model, request, response, next, value) {
        model.find({ _id: value })
        .then((value) => {
            response.locals[current] = value;
            next();
        })
        .catch((error) => {
            response.locals[current] = undefined;
            next();
        });
        
    }

    _getConnector(connector) {
        switch (typeof connector) {
            case 'string': 
                return this._getConnectorClassFunction(connector);
            case 'function': 
                return connector;
            default: 
                throw new Error('Router: Invalid connector type. Use either a function<serializable> or a string');
        }
        
    }

}