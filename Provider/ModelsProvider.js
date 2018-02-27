const Provider = require('./Provider'),
    path = require('path'),
    fs = require('fs');

module.exports = class ModelsProvider extends Provider {
    register() {
        const filenameList = fs.readdirSync(path.resolve('./Models'));
        const config = this.container.make('config');
        const modelExt = config.get('App.modelExt');
        filenameList.forEach(filename => {
            const Model = require(path.resolve('./Models/' + filename));
            const modelName = Model.list || filename.replace(modelExt, '');
            this.container.register('Model/' + modelName, Model.bind(null, modelName));
        });
    }
}
