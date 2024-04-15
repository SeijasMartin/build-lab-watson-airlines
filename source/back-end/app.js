const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const mongo = require("./mongodb");
const controller = require('./controller');

async function main() {
    try {
        // Get global variables from .env file
        require("dotenv").config({path: path.resolve(__dirname, ".env")});

        // Connect to database
        const { create_connection } = require("./mongodb");
        await create_connection();    

        // Crear una instancia de la aplicación Express
        const app = express();

        // Iniciar el servidor Express
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
        });

        app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON

        // Ruta GET para la página de inicio
        app.get('/', controller.inicio);

        // Ruta GET para obtener las aerolíneas
        app.get('/airlines', controller.getAirlines);

        // Ruta GET para obtener los vuelos con el aeropuerto de origen y de destino
        app.get('/flightsORDE', controller.getFlightsORDE);        

        // Ruta GET para obtener los vuelos con distintos atributos
        app.get('/flightsBy', controller.getFlightsBy);

        // Ruta GET para obtener información de un vuelo con su número
        app.get('/flightsByNumber', controller.getFlightByNumber);

    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
    }
}

main();
