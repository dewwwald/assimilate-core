'use-strict';

module.exports = class Seeder {
    constructor(container) {
        this.container = container;
    }

    insertItem(data) {
        const model = this.container.make('Model/' + this.list, data);
        return model.save();
    }

    insertList([head, ...tail], data = []) {
        if (head) {
            return this.insertItem(head).then((item) => {
                return this.insertList(tail, [...data, item.data]);
            });
        } else {
            return Promise.resolve(data);
        }
    }

    insert() {
        if (typeof this.data === 'Array') {
            return this.insertItem(this.data);
        } else {
            return this.insertList(this.data);
        }
    }
}