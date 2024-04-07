const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
    IATA_CODE: {
        type: String,
        required: true
    },
    AIRLINE: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Airline', airlineSchema);
