'use-strict';

const Provider = require('./Provider'),
    path = require('path'),
    fs = require('fs');

module.exports = class ModelsProvider extends Provider {
    register() {
        const customModelsRoot = path.resolve('./Models');
        const filenameList = fs.readdirSync(customModelsRoot);
        const coreModelsRoot = `${__dirname}/../Database/Models`;
        const coreFilenameList = fs.readdirSync(coreModelsRoot);
        const config = this.container.make('config');
        const modelExt = config.get('App.modelExt');
        filenameList.forEach(this._addModels.bind(this, customModelsRoot, modelExt));
        coreFilenameList.forEach(this._addModels.bind(this, coreModelsRoot, modelExt));

    }

    _addModels(root, modelExt, filename) {
        const Model = require(`${root}/${filename}`);
        const modelName = Model.list || filename.replace(modelExt, '');
        this.container.register('Model/' + modelName, Model.bind(null, modelName));
    }
}
