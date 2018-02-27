const path = require('path'),
    fs = require('fs'),
    Provider = require('./Provider'),
    ProviderManager = require('./ProviderManager');
    
module.exports = class ExtensionProvider extends Provider {
    register() {
        const providerManager = new ProviderManager(this.container);
        const filenameList = fs.readdirSync(path.resolve('./Providers'));
        const providerList = [];
        filenameList.forEach(filename => {
            providerList.push(require(path.resolve('./Providers/' + filename)));
        });
        providerManager.loadProviders(providerList);
    }
}
