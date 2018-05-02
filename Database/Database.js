'use-strict';

const fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = class Database {
    /**
     * Extension of Model files
     * @var modelExt
     */
    get modelExt() { return this._modelExt; }
    set modelExt(modelExt) { this._modelExt = modelExt; }

    /**
     * Config
     * @var config@epitome
     */
    get config() { return this._config; }
    set config(config) { this._config = config; }

    /**
     * contains a list of all registered models
     * @var modelList
     */
    get modelList() { return this._modelList || []; }
    set modelList(value) { this._modelList = value; }

    /**
     * deference the current database connection
     * @var connection
     */
    get instance() { return this._instance; }
    set instance(value) { this._instance = value; }

    initialize() {
        const customModelsRoot = path.resolve('./Models');
        const filenameList = fs.readdirSync(customModelsRoot);
        const coreModelsRoot = `${__dirname}/Models`;
        const coreFilenameList = fs.readdirSync(coreModelsRoot);
        filenameList.forEach(this._addModels.bind(this, customModelsRoot));
        coreFilenameList.forEach(this._addModels.bind(this, coreModelsRoot));
    }

    /**
     * Creates a Database Instance
     * @param { connector, host, port, database, username, password } config
     */
    constructor(config, modelExt) {
        this.config = config;
        if (config.connector === 'mongodb') {
            mongoose.Promise = Promise;
            const host = `${config.host}${config.port ? ':' + config.port : ''}`;
            const credentials = `${config.username && config.password
                ? config.username + ':' + config.password + '@'
                : ''}`.trim();
            const srv = config.localhost ? 'mongodb' : 'mongodb+srv'
            const dbConnection = `${srv}://${credentials}${host}/${config.database}`;
            mongoose.connect(dbConnection).then((instance) => {
                console.log(`Mongo DB connected, ${dbConnection}`);
            }).catch(e => {
                console.error(e);
            });
          this.modelExt = modelExt;
          this.initialize();
        } else {
            throw new Error('connector mongodb is the only supported connector type');
        }
    }

    _addModels(root, filename) {
        const Model = require(`${root}/${filename}`);
        const modelName = Model.list || filename.replace(this.modelExt, '');
        const schema = new Schema(Model.schema, Model.schemaOptions);
        mongoose.model(modelName, schema);
        this._setupModelClassBinding(modelName);
    }

    _getModel(modelName) {
        // #TODO: implement internal manager for this
        return mongoose.model(modelName);
    }

    _setupModelClassBinding(modelName) {
        this.modelList = [modelName, ...this.modelList];
        Object.defineProperty(this, modelName, {
            getter: this._getModel.bind(null, modelName)
        });
    }

    _dropDatabaseNow() {
        return new Promise((resolve, reject) => {
            mongoose.connection.db.dropDatabase((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    dropDatabase() {
        return new Promise((resolve, reject) => {
            mongoose.connection.once('open', () => {
                this._dropDatabaseNow().then(() => resolve()).catch(e => reject(e));
            });
        });
    }
}
