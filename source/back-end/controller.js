const { request, response: expressResponse } = require("express");
const path = require('path');
const Airline = require("./airlines.schema");
const Airport = require('./airports.schema');
const Flight = require('./flights.schema');

const { sendMessage } = require('./watsonAssistantConfig'); // Importa la función sendMessage de Watson Assistant

const inicio = async (req, res) => {
    // Prueba
    res.send('Watson Airlines es una de las aerolíneas más grandes de Estados Unidos. Con más de 30 años de historia, conectamos a las personas con las oportunidades mientras ampliamos la comprensión de nuestro planeta y las personas que lo habitan. Ofrecemos nuestro valor único y hospitalidad en más de 50 aeropuertos en más de 15 países. Además, somos miembros de la Asociación Internacional de Transporte Aéreo (IATA), una asociación comercial que representa a más de 300 aerolíneas, lo que equivale a aproximadamente el 83% del tráfico aéreo total. Esto nos permite operar de manera segura, eficiente y económica bajo reglas claramente definidas.');
};

// Importa las dependencias necesarias
const express = require('express');
const app = express();

const getDateToString = async (req, res = response) => {
    try {
        // Obtén la fecha de la consulta
        const dateString = req.query.date;

        // Parsea la fecha
        const dateObject = new Date(dateString);

        // Obtiene los componentes de la fecha
        const year = dateObject.getFullYear();
        const month = ('0' + (dateObject.getMonth() + 1)).slice(-2); // Añade un cero inicial si el mes es de un solo dígito
        const day = ('0' + dateObject.getDate()).slice(-2); // Añade un cero inicial si el día es de un solo dígito

        // Formatea la fecha como se espera en el enlace del frontend
        const formattedDate = `${year}-${month}-${day}`;

        // Devuelve la fecha formateada como respuesta
        res.status(200).json({
            /* #swagger.responses[200] = {
                "description": "OK",
                "content": {
                  "application/json": {
                    "schema": {
                        "type" : "object",
                        "properties" : {
                            "formattedDate": {
                                "type": "string"
                            }
                        }
                    }
                  }
                }
            } */
            formattedDate: formattedDate
        });
    } catch (error) {
        // Maneja los errores
        console.error('Error al procesar la fecha:', error);
        res.status(400).send('Error al procesar la fecha');
    }
}


// Ruta GET para obtener los aeropuertos
const getAirports = async (req, res = response) => {
    try {
        // Consultar los aeropuertos desde la base de datos
        const airports = await Airport.find({}, 'AIRPORT IATA_CODE');

        // Formatear los datos de los aeropuertos
        const airportData = airports.map(airport => ({
            name: airport.AIRPORT,
            iataCode: airport.IATA_CODE
        }));

        // Devolver los datos de los aeropuertos como respuesta
        res.json({
            result: airportData
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los aeropuertos:', error);
        res.status(500).json({ error: 'Error al obtener los aeropuertos' });
    }
}


const getAirlines = async (req, res = expressResponse) => {
    try {
        // Consultar las aerolíneas desde la base de datos
        const airlines = await Airline.find({}, 'AIRLINE');

        // Extraer solo los nombres de las aerolíneas
        const airlineNames = airlines.map(airline => airline.AIRLINE).join('\n');

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
        });

        // Devolver los vuelos encontrados como respuesta
        res.json({
            result: flights
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los vuelos:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos' });
    }
};



//obtener vuelos segun los distintos atributos
//ejemplo de url a usar: http://localhost:3000/flights?airline=WA&origin_airport=OGG&destination_airport=HNL&cancelled=true&departure_date=2023-01-01T14:45:00.000Z
const getFlightsBy = async (req = request, res = response) => {
    try {
        // Obtener los parámetros de la URL
        const origin_airport = req.query.origin_airport;
        const destination_airport = req.query.destination_airport;
        const departure_date_start = req.query.departure_date_start; // Fecha de salida inicial del rango
        const departure_date_end = req.query.departure_date_end; // Fecha de salida final del rango
        const arrival_date = req.query.arrival_date;

        // Construir el objeto de filtro para la consulta
        const filter = {};

        if (origin_airport) {
            filter.ORIGIN_AIRPORT = origin_airport;
        }

        if (destination_airport) {
            filter.DESTINATION_AIRPORT = destination_airport;
        }

        if (departure_date_start && departure_date_end) {
            // Si se proporciona un rango de fechas, convertir las cadenas de fecha en objetos Date
            const startDate = new Date(departure_date_start);
            const endDate = new Date(departure_date_end);
            
            // Sumar 1 día a la fecha de finalización del rango
            endDate.setDate(endDate.getDate() + 1);
        
            // Agregar condiciones al filtro para que la fecha de partida esté dentro del rango
            filter.DEPARTURE_DATE = { $gte: startDate, $lt: endDate };
        } else if (departure_date_start) {
            // Si solo se proporciona una fecha de inicio, agregar esa fecha al filtro
            filter.DEPARTURE_DATE = new Date(departure_date_start);
        }
              

        if (arrival_date) {
            filter.ARRIVAL_DATE = arrival_date;
        }

        // Consultar los vuelos según los filtros proporcionados
        const flights = await Flight.find(filter);

        // Devolver los vuelos como respuesta
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
                                  "$ref": "#/definitions/Flight"
                                }
                            }
                        }
                    }
                  }
                }
            } */
            result: flights
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

module.exports = {
    getDateToString,
    getAirlines,
    getFlightsORDE,
    getFlightsBy,
    getFlightByNumber,
    getAirports,
    inicio
};
