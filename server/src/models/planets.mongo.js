const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    keplerName: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('Planet', planetsSchema);
