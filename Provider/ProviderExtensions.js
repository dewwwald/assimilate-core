'use-strict';

const path = require('path'),
    fs = require('fs');
    
module.exports = class ProviderExtensions {
    static get() {
        const filenameList = fs.readdirSync(path.resolve('./Providers'));
        const providerList = [];
        filenameList.forEach(filename => {
            providerList.push(require(path.resolve('./Providers/' + filename)));
        });
        return providerList;
    }
}
