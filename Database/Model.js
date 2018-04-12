const path = require('path'),
    mongoose = require('mongoose'),
    { Types } = mongoose;

module.exports = class Model {
    static get schemaOptions() {
        return {};
    }

    get list() {
        return this._list || undefined;
    }

    get model() {
        return this._model;
    }

    set model(value) {
        this._model = value;
    }

    get data() {
        return this._data;
    }

    get() {
        return new Promise((function createGetQueryPromise(resolve, reject) {
            this.model.find(this._queryResponseHandle.bind(this, resolve, reject));
        }).bind(this));
    }

    find(query) {
        return new Promise((function createFindQueryPromise(resolve, reject) {
            if (query._id && !Types.ObjectId.isValid(query._id)) {
                reject(new Error('Invalid id provided.'));
                return;
            }
            this.model
                .findOne(query)
                .exec(this._queryResponseHandle.bind(this, resolve, reject));
        }).bind(this));
    }

    save() {
        return new Promise((function saveProimise(resolve, reject) {
            const Model = this.model;
            const model = new Model(this.data);
            model.save(this._queryResponseHandle.bind(this, resolve, reject));
        }).bind(this));
    }

    update(data) {
        return new Promise((function updateProimise(resolve, reject) {
            this.model.findByIdAndUpdate(this.data._id, { 
                $set: {data} 
            }, this._updateResponseHandle.bind(this, resolve, reject, data));
        }).bind(this));
    }

    delete() {
        return new Promise((function deleteProimise(resolve, reject) {
            if (this.data) {
                this.data.remove(function (error, object) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(object);
                });
            } else {
                resolve(null);
            }
        }).bind(this));
    }

    constructor(modelName, data) {
        this._list = modelName;
        this.model = mongoose.model(modelName);
        this._data = data || {};
    }

    _updateResponseHandle(resolve, reject, data, error) {
        if (error) return reject(error);
        this._data = { ...this.data, ...data };
        resolve(this);
    }

    _queryResponseHandle (resolve, reject, error, result) {
        if (error) {
            reject(error);
        } else {
            this._data = result;
            resolve(this);
        }
    }

    toJSON() {
        return this.data;
    }
}