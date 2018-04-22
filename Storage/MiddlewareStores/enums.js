'use strict';

const LOCAL_STORAGE = 'local.disk';
const AWS_S3_STORAGE = 'aws.s3';
const MEMORY_STORAGE = 'local.memory';
const PROVIDER_LIST = [LOCAL_STORAGE, MEMORY_STORAGE, AWS_S3_STORAGE];

module.exports = {
    LOCAL_STORAGE,
    AWS_S3_STORAGE,
    MEMORY_STORAGE,
    PROVIDER_LIST
};
