const { request, response } = require("express");
const path = require('path');
const Airport = require('./airports.schema');
const Airline = require("./airlines.schema");
const Flight = require('./flights.schema');

/**
 * Controlador para obtener la lista de aerolíneas desde la base de datos
 * @param {JSON} req Objeto de solicitud HTTP
 * @param {JSON} res Objeto de respuesta HTTP
 * @returns {JSON} Lista de aerolíneas
 */

const inicio = async (req = request, res = response) => {
    // Enviar el archivo index.html ubicado en la carpeta frontend
    res.sendFile(path.join(__dirname, '../front-end', 'index.html'));
};

const getAirlines = async (req = request, res = response) => {
    try {
        // Consultar las aerolíneas desde la base de datos
        const airlines = await Airline.find({}, 'IATA_CODE AIRLINE');

        // Devolver la lista de aerolíneas como respuesta
        res.json({
            result: airlines
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener las aerolíneas:', error);
        res.status(500).json({ error: 'Error al obtener las aerolíneas' });
    }
};

// Ruta GET para obtener los aeropuertos
const getAirports = async (req = request, res = response) => {
    try {
        // Consultar los aeropuertos desde la base de datos
        const airports = await Airport.find({}, 'IATA_CODE AIRPORT CITY STATE COUNTRY');
        res.json({
            result: airports
        });
    } catch (error) {
        console.error('Error al obtener los aeropuertos:', error);
        res.status(500).json({ error: 'Error al obtener los aeropuertos' });
    }
};

const getFlights = async (req = request, res = response) => {
    try {
        // Consultar los aeropuertos desde la base de datos
        const flights = await Flight.find({}, 'AIRLINE FLIGHT_NUMBER ORIGIN_AIRPORT DESTINATION_AIRPORT CANCELLED DEPARTURE_DATE ARRIVAL_DATE');
        res.json({
            result : flights
        });
    } catch (error) {
        console.error('Error al obtener los vuelos:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos' });
    }
};

const getFlightsByAirline = async (req = request, res = response) => {
    const airline = req.params.airline;
    const origin_airport = req.params.origin_airport;

    try {
        // Consultar los vuelos de la aerolínea especificada desde la base de datos
        const flights = await Flight.find({ AIRLINE: airline, ORIGIN_AIRPORT: origin_airport }, 'FLIGHT_NUMBER ORIGIN_AIRPORT DESTINATION_AIRPORT CANCELLED DEPARTURE_DATE ARRIVAL_DATE');

        // Devolver la lista de vuelos como respuesta
        res.json({
            result: flights
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los vuelos de la aerolínea:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos de la aerolínea' });
    }
};

module.exports = {
    getAirlines,
    getAirports,
    getFlights,
    getFlightsByAirline,
    inicio
};
