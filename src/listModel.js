const {Schema, model} = require('mongoose');

const listSchema = new Schema({
    userId: {
        type: String,
        required: true
    },

    id: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        required: true,
    },

    done: {
        type: Boolean,
        required: true,
    },
});

module.exports = model('List', listSchema);