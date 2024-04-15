const { request, response: expressResponse } = require("express");
const path = require('path');
const Airport = require('./airports.schema');
const Airline = require("./airlines.schema");
const Flight = require('./flights.schema');

const { sendMessage } = require('./watsonAssistantConfig'); // Importa la función sendMessage de Watson Assistant

/**
 * Controlador para obtener la lista de aerolíneas desde la base de datos
 * @param {JSON} req Objeto de solicitud HTTP
 * @param {JSON} res Objeto de respuesta HTTP
 * @returns {JSON} Lista de aerolíneas
 */

const inicio = async (req, res) => {
    // Prueba
    res.send('Watson Airlines es una de las aerolíneas más grandes de Estados Unidos. Con más de 30 años de historia, conectamos a las personas con las oportunidades mientras ampliamos la comprensión de nuestro planeta y las personas que lo habitan. Ofrecemos nuestro valor único y hospitalidad en más de 50 aeropuertos en más de 15 países. Además, somos miembros de la Asociación Internacional de Transporte Aéreo (IATA), una asociación comercial que representa a más de 300 aerolíneas, lo que equivale a aproximadamente el 83% del tráfico aéreo total. Esto nos permite operar de manera segura, eficiente y económica bajo reglas claramente definidas.');
};


const getAirlines = async (req, res = expressResponse) => {
    try {
        // Consultar las aerolíneas desde la base de datos
        const airlines = await Airline.find({}, 'AIRLINE');

        // Extraer solo los nombres de las aerolíneas
        const airlineNames = airlines.map(airline => airline.AIRLINE);

        // Devolver solo los nombres de las aerolíneas como respuesta
        res.json({
            /* #swagger.responses[200] = {
                "description": "OK",
                "content": {
                  "application/json": {
                    "schema": {
                        "type" : "object",
                        "properties" : {
                            "result" : {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                }
                            }
                        }
                    }
                  }
                }
            } */
            result: airlineNames
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener las aerolíneas:', error);
        res.status(500).json({ error: 'Error al obtener las aerolíneas' });
    }
};



// Ruta GET para obtener los aeropuertos
const getAirports = async (req, res = response) => {
    try {
        // Consultar los aeropuertos desde la base de datos
        const airports = await Airport.find({}, 'AIRPORT');

        // Extraer solo los nombres de los aeropuertos
        const airportNames = airports.map(airport => airport.AIRPORT);

        // Devolver solo los nombres de los aeropuertos como respuesta
        res.json({
            /* #swagger.responses[200] = {
                "description": "OK",
                "content": {
                  "application/json": {
                    "schema": {
                        "type" : "object",
                        "properties" : {
                            "result" : {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                }
                            }
                        }
                    }
                  }
                }
            } */
            result: airportNames
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los aeropuertos:', error);
        res.status(500).json({ error: 'Error al obtener los aeropuertos' });
    }
};

// conseguir vuelos segun aeropuerto de origen y de destino
const getFlightsORDE = async (req = request, res = response) => {
    try {
        // Obtener los aeropuertos de origen y destino de la consulta
        const originAirport = req.query.origin_airport;
        const destinationAirport = req.query.destination_airport;

        // Consultar los vuelos desde la base de datos
        const flights = await Flight.find({
            ORIGIN_AIRPORT: originAirport,
            DESTINATION_AIRPORT: destinationAirport
        }, 'FLIGHT_NUMBER');

        // Extraer solo los números de vuelo
        const flightNumbers = flights.map(flight => flight.FLIGHT_NUMBER);

        // Devolver los números de vuelo como respuesta
        res.json({
            /* #swagger.responses[200] = {
                "description": "OK",
                "content": {
                  "application/json": {
                    "schema": {
                        "type" : "object",
                        "properties" : {
                            "result" : {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                }
                            }
                        }
                    }
                  }
                }
            } */
            result: flightNumbers
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los números de vuelo:', error);
        res.status(500).json({ error: 'Error al obtener los números de vuelo' });
    }
};


//obtener vuelos segun los distintos atributos
//ejemplo de url a usar: http://localhost:3000/flights?airline=WA&origin_airport=OGG&destination_airport=HNL&cancelled=true&departure_date=2023-01-01T14:45:00.000Z
const getFlightsBy = async (req = request, res = response) => {
    try {
        // Obtener los parámetros de la URL
        const airline = req.query.airline;
        const flight_number = req.query.flight_number;
        const origin_airport = req.query.origin_airport;
        const destination_airport = req.query.destination_airport;
        const departure_date_start = req.query.departure_date_start; // Fecha de salida inicial del rango
        const departure_date_end = req.query.departure_date_end; // Fecha de salida final del rango
        const arrival_date = req.query.arrival_date;
        const cancelled = req.query.cancelled;

        // Construir el objeto de filtro para la consulta
        const filter = {};

        if (airline) {
            filter.AIRLINE = airline;
        }

        if (flight_number) {
            filter.FLIGHT_NUMBER = flight_number;
        }

        if (origin_airport) {
            filter.ORIGIN_AIRPORT = origin_airport;
        }

        if (destination_airport) {
            filter.DESTINATION_AIRPORT = destination_airport;
        }

        if (departure_date_start && departure_date_end) {
            // Si se proporciona un rango de fechas, agregar condiciones al filtro
            filter.DEPARTURE_DATE = { $gte: departure_date_start, $lte: departure_date_end };
        } else if (departure_date) {
            // Si solo se proporciona una fecha, agregar esa fecha al filtro
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

        // Extraer solo los números de vuelo
        const flightNumbers = flights.map(flight => flight.FLIGHT_NUMBER);

        // Devolver los números de vuelo como respuesta
        res.json({
            /* #swagger.responses[200] = {
                "description": "OK",
                "content": {
                  "application/json": {
                    "schema": {
                        "type" : "object",
                        "properties" : {
                            "result" : {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                }
                            }
                        }
                    }
                  }
                }
            } */
            result: flightNumbers
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los vuelos:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos' });
    }
};

const getFlightByNumber = async (req = request, res = response) => {
    try {
        // Obtener el número de vuelo de la consulta
        const flightNumber = req.query.flight_number;

        // Consultar la información del vuelo según el número de vuelo
        const flight = await Flight.findOne({ FLIGHT_NUMBER: flightNumber });

        // Construir el string con las propiedades del vuelo
        let flightString = `Aerolínea: ${flight.AIRLINE}\n `
            + `Aeropuerto de origen: ${flight.ORIGIN_AIRPORT}\n `
            + `Aeropuerto de destino: ${flight.DESTINATION_AIRPORT}\n `
            + `Cancelado: ${flight.CANCELLED}\n `
            + `Fecha de salida: ${flight.DEPARTURE_DATE}\n `
            + `Fecha de llegada: ${flight.ARRIVAL_DATE}`;

        // Devolver el string con la información del vuelo como respuesta
        res.json({
            /* #swagger.responses[200] = {
                "description": "OK",
                "content": {
                  "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "result": {
                                "type": "string"
                            }
                        }
                    }
                  }
                }
            } */
            result: flightString
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener la información del vuelo:', error);
        res.status(500).json({ error: 'Error al obtener la información del vuelo' });
    }
};





const getHola = async (req, res = response) => {
    try {
        // Definir el mensaje que quieres enviar
        const mensaje = "Hola";

        // Devolver el mensaje como respuesta
        res.json({
            /* #swagger.responses[200] = {
                "description": "OK",
                "content": {
                  "application/json": {
                    "schema": {
                        "type" : "object",
                        "properties" : {
                            "message" : {
                                "type": "string"
                            }
                        }
                    }
                  }
                }
            } */
            message: mensaje
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener el mensaje:', error);
        res.status(500).json({ error: 'Error al obtener el mensaje' });
    }
};


module.exports = {
    getAirlines,
    getAirports,
    getFlightsORDE,
    getFlightsBy,
    getFlightByNumber,
    getHola,
    inicio
};
