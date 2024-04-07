const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const mongo = require("./sample.mongodb");
const Airline = require('./airlines.schema');
const Airport = require('./airports.schema');
const Flight = require('./flights.schema');


async function main(){
   
    // Get global variables from .env file
    require("dotenv").config({path: path.resolve(__dirname,".env")});

    // Connect to database
    const { create_connection } = require("./sample.mongodb");
    await create_connection();    
    
    const Sample = require("./sample.schema");

    async function sample_schema(){
        console.log(await Sample.find({}));
    }
    
    // Crear una instancia de la aplicación Express
    const app = express();

    // Iniciar el servidor Express
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
    });

    // Ruta GET para obtener las aerolíneas
    app.get('/airlines', async (req, res) => {
        try {
            // Consultar las aerolíneas desde la base de datos
            const airlines = await Airline.find({}, 'IATA_CODE AIRLINE');
            res.json(airlines);
            debugger;
        } catch (error) {
            console.error('Error al obtener las aerolíneas:', error);
            res.status(500).json({ error: 'Error al obtener las aerolíneas' });
            debugger;
        }
    });

    // Ruta GET para obtener los aeropuertos
    app.get('/airports', async (req, res) => {
        try {
            // Consultar los aeropuertos desde la base de datos
            const airports = await Airport.find({}, 'IATA_CODE AIRPORT CITY STATE COUNTRY');
            res.json(airports);
        } catch (error) {
            console.error('Error al obtener los aeropuertos:', error);
            res.status(500).json({ error: 'Error al obtener los aeropuertos' });
        }
    });
    
    // Ruta GET para obtener los vuelos
    app.get('/flights', async (req, res) => {
        try {
            // Consultar los aeropuertos desde la base de datos
            const flights = await Flight.find({}, 'AIRLINE FLIGHT_NUMBER ORIGIN_AIRPORT DESTINATION_AIRPORT CANCELLED DEPARTURE_DATE ARRIVAL_DATE');
            res.json(flights);
        } catch (error) {
            console.error('Error al obtener los vuelos:', error);
            res.status(500).json({ error: 'Error al obtener los vuelos' });
        }
    });

}

main();