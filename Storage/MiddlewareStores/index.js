'use-strict';

const AwsS3Storage = require('./AwsS3');
const LocalStorage = require('./Local');
const { LOCAL_STORAGE, AWS_S3_STORAGE, MEMORY_STORAGE, PROVIDER_LIST } = require('./enums');

module.exports = {
    LOCAL_STORAGE,
    AWS_S3_STORAGE,
    MEMORY_STORAGE,
    PROVIDER_LIST,
    AwsS3Storage,
    LocalStorage
};
