'use-strict';

const Storage = require('./Storage');
const {
    PROVIDER_LIST,
    LOCAL_STORAGE,
    AWS_S3_STORAGE,
    MEMORY_STORAGE
} = require('./MiddlewareStores');
const StorageProvider = require('./Storage.Provider');

module.exports = {
    Storage,
    StorageProvider,
    PROVIDER_LIST,
    LOCAL_STORAGE,
    AWS_S3_STORAGE,
    MEMORY_STORAGE
};
