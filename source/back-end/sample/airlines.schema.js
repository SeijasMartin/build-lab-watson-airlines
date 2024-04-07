const mongoose = require('mongoose');

const airlines_schema = new mongoose.Schema({
  IATA_CODE : String,
  AIRLINE : String
});

const Airline = mongoose.model("Airline", airlines_schema);

module.exports = Airline;