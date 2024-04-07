const mongoose = require('mongoose');

const flights_schema = new mongoose.Schema({
    AIRLINE : String,
    FLIGHT_NUMBER : Number,
    ORIGIN_AIRPORT : String,
    DESTINATION_AIRPORT : String,
    CANCELLED : Boolean,
    DEPARTURE_DATE : Date,
    ARRIVAL_DATE : Date
});
const Flight = mongoose.model("Flight", flights_schema);

module.exports = Flight;