'use-strict';

const path = require('path'),
    defined = require('../Lib/defined'),
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

    get(path, ...connectors) {
        const connectorsLastIndex = connectors.length - 1
        const mainControllerƒ = this._getConnector(connectors[connectorsLastIndex]);
        const middlewareFunctions = this._getConnectors(connectors.slice(0, connectorsLastIndex));
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        middlewareFunctions.forEach(middlewareƒ => {
            this.router.get(this._makePath(path), this._wrapFunction(middlewareƒ, ...args));
        });
        this.router.get(this._makePath(path), this._reverseWrapFunction(mainControllerƒ, ...args));
        return this;
    }
    
    post(path, ...connectors) {
        const connectorsLastIndex = connectors.length - 1
        const mainControllerƒ = this._getConnector(connectors[connectorsLastIndex]);
        const middlewareFunctions = this._getConnectors(connectors.slice(0, connectorsLastIndex));
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        middlewareFunctions.forEach(middlewareƒ => {
            this.router.post(this._makePath(path), this._wrapFunction(middlewareƒ, ...args, DATA));
        }); 
        this.router.post(this._makePath(path), this._reverseWrapFunction(mainControllerƒ, ...args, DATA));       
        return this;
    }
    
    put(path, ...connectors) {
        const connectorsLastIndex = connectors.length - 1
        const mainControllerƒ = this._getConnector(connectors[connectorsLastIndex]);
        const middlewareFunctions = this._getConnectors(connectors.slice(0, connectorsLastIndex));
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        middlewareFunctions.forEach(middlewareƒ => {
            this.router.put(this._makePath(path), this._wrapFunction(middlewareƒ, ...args, DATA));
        }); 
        this.router.put(this._makePath(path), this._reverseWrapFunction(mainControllerƒ, ...args, DATA));       
        return this;
    }
    
    delete(path, ...connectors) {
        const connectorsLastIndex = connectors.length - 1
        const mainControllerƒ = this._getConnector(connectors[connectorsLastIndex]);
        const middlewareFunctions = this._getConnectors(connectors.slice(0, connectorsLastIndex));
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        middlewareFunctions.forEach(middlewareƒ => {
            this.router.delete(this._makePath(path), this._wrapFunction(middlewareƒ, ...args));
        });
        this.router.delete(this._makePath(path), this._reverseWrapFunction(mainControllerƒ, ...args));
        return this;
    }
    
    patch(path, ...connectors) {
        const connectorsLastIndex = connectors.length - 1
        const mainControllerƒ = this._getConnector(connectors[connectorsLastIndex]);
        const middlewareFunctions = this._getConnectors(connectors.slice(0, connectorsLastIndex));
        const args = this._buildArgs(path);
        this._configureParamListMiddleware(args);
        middlewareFunctions.forEach(middlewareƒ => {
            this.router.patch(this._makePath(path), this._wrapFunction(middlewareƒ, ...args, DATA));
        });
        this.router.patch(this._makePath(path), this._reverseWrapFunction(mainControllerƒ, ...args, DATA));
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
        const controllerName = matches[1];
        const controllerMethod = matches[2];
        const controllerExt = this.container.make('config').get('App.controllerExt');
        const Controller = require(path.resolve('./Controllers/' + controllerName + controllerExt));
        const controllerInstance = new Controller(this.container);
        if (defined(controllerInstance[controllerMethod])) {
            return controllerInstance[controllerMethod].bind(controllerInstance);
        } else {
            throw new Error('Controller: ' + controllerName + ' has no function named ' + controllerMethod);
        }
    }

    _reverseWrapFunction(mainControllerƒ, ...args) {
        return function (request, response, ...other) {
            let params = [];
            args.forEach(param => {
                params = [...params, (response.locals[param] || undefined)];
            });
            mainControllerƒ(request, response, ...params, ...other);
        }
    }

    _wrapFunction(middlewareƒ, ...args) {
        return function (request, response, ...other) {
            let params = [];
            args.forEach(param => {
                params = [...params, (response.locals[param] || undefined)];
            });
            middlewareƒ(request, response, ...other, ...params);
        }
    }

    _configureParamListMiddleware(args) {
        args.forEach(this._configureParamNameMiddleware.bind(this));
    }

    _configureParamNameMiddleware(param) {
        const tries = [param.charAt(0).toUpperCase() + param.substring(1), param];
        let i = 0, model = undefined;
        const database = this.container.make('database');
        do {
            if (database.modelList.includes(tries[i])) {
                model = this.container.make('Model/' + tries[i], undefined, true);    
            }
            i++;
        } while (i < tries.length && !defined(model)) 
        if (defined(model)) {
            this.router.param(param, this._handleKnownParamsModels.bind(this, param, model));
        }
    }

    _handleKnownParamsModels(current, model, request, response, next, value) {
        model.findOne({ _id: value }).then((value) => {
            response.locals[current] = value;
            next();
        }).catch((error) => {
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

    _getConnectors(connectors) {
        return connectors.map(connector => {
            return this._getConnector(connector);
        });
    }

}