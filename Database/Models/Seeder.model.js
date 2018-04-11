const { Model, SERIALIZE_ALL } = require('../');

module.exports = class SeederModel extends Model {
    static get schema() {
        return {
            name: String,
            target: String,
            state: [String]
        };
    }

    static get schemaOptions() {
        return { timestamps: true };
    }

    get serializable() {
        return SERIALIZE_ALL;
    }
}
