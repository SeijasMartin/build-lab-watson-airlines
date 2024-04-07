const mongoose = require('mongoose');

const airports_schema = new mongoose.Schema({
  IATA_CODE : String,
  AIRPORT : String,
  CITY : String,
  STATE : String,
  COUNTRY : String
});

const Airport = mongoose.model("Airport", airports_schema);

module.exports = Airport;