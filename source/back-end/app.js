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

        // Middleware para permitir CORS solo para una URL específica
        app.use((req, res, next) => {
            // Verificar si la solicitud proviene de la URL específica
            if (req.get('origin') === 'https://frontend-88.1fns2dopbijw.us-east.codeengine.appdomain.cloud') {
                res.header('Access-Control-Allow-Origin', req.get('origin'));
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            }
            next();
        });
        // Ruta GET para la página de inicio
        app.get('/', controller.inicio);

        // Ruta GET para convertir la fecha a formato string y así watson pueda pasar el link correcto al usuario
        app.get('/dateToString', controller.getDateToString);

        // Ruta GET para obtener los aeropuertos
        app.get('/airports', controller.getAirports);

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
