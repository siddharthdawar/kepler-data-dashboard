const mongoose = require('mongoose');

// what each launch will look like
const launchesSchema = new mongoose.Schema({
    customers: [String],
    flightNumber: {
        required: true,
        type: Number
    },
    launchDate: {
        required: true,
        type: Date
    },
    mission: {
        required: true,
        type: String
    },
    rocket: {
        required: true,
        type: String
    },
    success: {
        default: true,
        required: true,
        type: Boolean
    },
    target: {
        required: true,
        type: String
    },
    upcoming: {
        required: true,
        type: Boolean
    }
});

// connect launches schema to launches collection in the mongo database
module.exports = mongoose.model('Launch', launchesSchema);
