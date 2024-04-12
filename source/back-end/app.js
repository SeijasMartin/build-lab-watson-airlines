const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const mongo = require("./mongodb");
const controller = require('./controller');


async function main(){
   
    // Get global variables from .env file
    require("dotenv").config({path: path.resolve(__dirname,".env")});

    // Connect to database
    const { create_connection } = require("./mongodb");
    await create_connection();    
    
    // Crear una instancia de la aplicación Express
    const app = express();


    /**esto me daba error por el cors
     * app.use(cors({
        origin: 'https://frontend-88.1fns2dopbijw.us-east.codeengine.appdomain.cloud'
      }));
*/

    // Iniciar el servidor Express
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
    });

    app.get('/', controller.inicio);
      
    // Ruta GET para obtener las aerolíneas
    app.get('/airlines', controller.getAirlines);

    // Ruta GET para obtener los aeropuertos
    app.get('/airports', controller.getAirports);
    
    // Ruta GET para obtener los vuelos
    //app.get('/flights', controller.getFlights);

    app.get('/flights', controller.getFlightsBy);

}

main();