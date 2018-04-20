'use-strict';

const path = require('path'),
    mongoose = require('mongoose'),
    { Types } = mongoose,
    SERIALIZE_ALL = require('../');

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

    find(query, settings = {}) {
        return new Promise((function createFindQueryPromise(resolve, reject) {
            if (query._id && !Types.ObjectId.isValid(query._id)) {
                reject(new Error('Invalid id provided.'));
                return;
            }
            this.model.find(query, settings).exec(this._queryResponseHandle.bind(this, resolve, reject));
        }).bind(this));
    }

    findOne(query, settings = {}) {
        return new Promise((function createFindQueryPromise(resolve, reject) {
            if (query._id && !Types.ObjectId.isValid(query._id)) {
                reject(new Error('Invalid id provided.'));
                return;
            }
            this.model.findOne(query, settings).exec(this._queryResponseHandle.bind(this, resolve, reject));
        }).bind(this));
    }

    count(query) {
        return new Promise((function createCountQueryPromise(resolve, reject) {
            if (query._id && !Types.ObjectId.isValid(query._id)) {
                reject(new Error('Invalid id provided.'));
                return;
            }
            this.model.count(query).exec(this._queryResponseHandle.bind(this, resolve, reject));
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
            if (this.data._id) {
                this.model.findOne({ _id: this.data._id }, (error, mongoUser) => {
                    Object.keys(data).forEach(key => {
                        mongoUser[key] = data[key];
                    });
                    mongoUser.save(this._updateResponseHandle.bind(this, resolve, reject, data));
                });
            } else {
                reject(new Error('@epitome/Model: document being updated not found.'));
            }
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
        Object.keys(data).forEach(key => {
            this._data[key] = data[key];
        });
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

    serializeData(serializable) {
        const data = this.toJSON()._doc || this.toJSON();
        Object.keys(data).forEach(key => {
            if (!serializable.includes(key)) {
                delete data[key];
            }
        });
        return data;
    }

    serialize() {
        if (!this.data)
            throw new Error(`attempted to @epitome.Model.serialize ${this.list} when unknown`);
        const serializable = this.serializable || SERIALIZE_ALL
        if (serializable === SERIALIZE_ALL) {
            return this.data;
        } else if (typeof serializable.length !== 'undefined') {
            return this.serializeData(serializable);
        } else {
            return [];
        }
    }
}
