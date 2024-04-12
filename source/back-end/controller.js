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
    // Enviar el texto "¡Hola mundo!" como respuesta
    res.send('Watson Airlines es una de las aerolíneas más grandes de Estados Unidos. Con más de 30 años de historia, conectamos a las personas con las oportunidades mientras ampliamos la comprensión de nuestro planeta y las personas que lo habitan. Ofrecemos nuestro valor único y hospitalidad en más de 50 aeropuertos en más de 15 países. Además, somos miembros de la Asociación Internacional de Transporte Aéreo (IATA), una asociación comercial que representa a más de 300 aerolíneas, lo que equivale a aproximadamente el 83% del tráfico aéreo total. Esto nos permite operar de manera segura, eficiente y económica bajo reglas claramente definidas.');
};


const getAirlines = async (req, res = expressResponse) => {
    try {
        // Cadena de texto estática para enviar a Watson Assistant
        const text = "Prueba de mensaje estático para Watson Assistant";

        // Enviar la cadena de texto a Watson Assistant y obtener la respuesta
        const watsonResponse = await sendMessage(text);

        // Extraer el mensaje de la respuesta de Watson Assistant
        const watsonMessage = watsonResponse.output.generic[0].text;

        // Devolver el mensaje de Watson Assistant como respuesta
        res.send(watsonMessage);
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
