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
        const filenameList = fs.readdirSync(path.resolve('./Models'));
        filenameList.forEach(filename => {
            const Model = require(path.resolve('./Models/' + filename));
            const modelName = Model.list || filename.replace(this.modelExt, '');
            const schema = new Schema(Model.schema, Model.schemaOptions);
            mongoose.model(modelName, schema);
            this._setupModelClassBinding(modelName);
        });
    }

    /**
     * Creates a Database Instance
     * @param { connector, host, port, database, username, password } config
     */
    constructor(config, modelExt) {
        if (config.connector === 'mongodb') {
          mongoose.connect(`mongodb://${config.host}:${config.port}/${config.database}`)
            .then(() => {
              console.log(`Mongo DB connected, mongodb://${config.host}:${config.port}/${config.database}`);
            })
            .catch(e => {
              console.error(e);
            });
          this.modelExt = modelExt;
          this.initialize();
        } else {
            throw new Error('connector mongodb is the only supported connector type');
        }
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
