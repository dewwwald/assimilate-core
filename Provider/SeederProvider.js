const Provider = require('./Provider'),
    fs = require('fs'),
    path = require('path');

module.exports = class SeederProvider extends Provider {
    register() {
        const seederTable = this.container.make('Model/Seeder');
        seederTable.get().then(() => {
            const ignoreList = seederTable.data.map(x => x.name + '.js');
            const seedFileList = fs.readdirSync(path.resolve('./Seeds'));
            seedFileList.forEach(filename => this.handleSeeds(filename, ignoreList));
        });
    }

    handleSeeds(fileName, ignoreList) {
        if (!ignoreList.includes(fileName)) {
            const Seeding = require(path.resolve('./Seeds/' + fileName));
            const seeding = new Seeding(this.container);
            seeding.insert().then((items) => {
                console.log(typeof items);
                const Seeder = this.container.make('Model/Seeder', {
                    name: fileName.replace('.js', ''),
                    target: seeding.list,
                    state: typeof items.length !== 'undefined' ? items.map(x => x._id) : [items]
                });
                console.log(Seeder.data);
                Seeder.save();
            });
        }
    }
}
