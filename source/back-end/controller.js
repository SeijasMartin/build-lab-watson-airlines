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

const inicio = async (req, res) => {
    // Enviar el texto "¡Hola mundo!" como respuesta
    res.send('¡Hola mundo!');
};


const getAirlines = async (req = request, res = response) => {
    try {
        // Consultar las aerolíneas desde la base de datos
        const airlines = await Airline.find({}, 'AIRLINE');

        // Extraer solo los nombres de las aerolíneas del resultado
        const airlineNames = airlines.map(airline => airline.AIRLINE);

        // Convertir la lista de nombres en un solo string separado por comas
        const airlineNamesString = airlineNames.join(', ');

        // Devolver el string con los nombres de las aerolíneas como respuesta
        res.send(airlineNamesString);
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

// conseguir vuelos segun aeropuerto de origen y de destino
const getFlightsORDE = async (req = request, res = response) => {
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

//obtener vuelos segun los distintos atributos
//ejemplo de url a usar: http://localhost:3000/flights?airline=WA&origin_airport=OGG&destination_airport=HNL&cancelled=true&departure_date=2023-01-01T14:45:00.000Z
const getFlightsBy = async (req = request, res = response) => {
    try {
        // Obtener los parámetros de la URL
        const airline = req.query.airline;
        const origin_airport = req.query.origin_airport;
        const destination_airport = req.query.destination_airport;
        const departure_date = req.query.departure_date;
        const arrival_date = req.query.arrival_date;
        const cancelled = req.query.cancelled;

        // Construir el objeto de filtro para la consulta
        const filter = {};

        if (airline) {
            filter.AIRLINE = airline;
        }

        if (origin_airport) {
            filter.ORIGIN_AIRPORT = origin_airport;
        }

        if (destination_airport) {
            filter.DESTINATION_AIRPORT = destination_airport;
        }

        if (departure_date) {
            filter.DEPARTURE_DATE = departure_date;
        }

        if (arrival_date) {
            filter.ARRIVAL_DATE = arrival_date;
        }

        if (cancelled) {
            filter.CANCELLED = cancelled === 'true'; // Convertir a booleano si es necesario
        }

        // Consultar los vuelos según los filtros proporcionados
        const flights = await Flight.find(filter);

        // Construir el string con los datos de los vuelos
        let flightsString = '';
        flights.forEach(flight => {
            flightsString += `AIRLINE: ${flight.AIRLINE}, FLIGHT_NUMBER: ${flight.FLIGHT_NUMBER}, ORIGIN_AIRPORT: ${flight.ORIGIN_AIRPORT}, DESTINATION_AIRPORT: ${flight.DESTINATION_AIRPORT}, CANCELLED: ${flight.CANCELLED}, DEPARTURE_DATE: ${flight.DEPARTURE_DATE}, ARRIVAL_DATE: ${flight.ARRIVAL_DATE}\n\n`;
        });

        // Devolver el string con los datos de los vuelos como respuesta
        res.send(flightsString);
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los vuelos:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos' });
    }
};







module.exports = {
    getAirlines,
    getAirports,
    getFlightsORDE,
    getFlightsBy,
    inicio
};
