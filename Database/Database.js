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
     * contains a list of all registered models
     * @var modelList
     */
    get modelList() { return this._modelList || []; }
    set modelList(value) { this._modelList = value; }


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
        if (config.connector === 'mongodb') {
            mongoose.Promise = Promise;
            const dbName = `mongodb://${config.host}:${config.port}/${config.database}`;
            mongoose.connect(dbName).then(() => {
                console.log(`Mongo DB connected, ${dbName}`);
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
}
