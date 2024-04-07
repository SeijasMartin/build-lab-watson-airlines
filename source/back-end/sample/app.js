const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const mongo = require("./sample.mongodb");

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

    // Ruta GET para obtener las aerolíneas
    app.get('/aerolineas', async (req, res) => {
        try {
            // Consultar las aerolíneas desde la base de datos
            const aerolineas = await Sample.find({}, 'IATA_CODE AIRLINE');
            res.json(aerolineas);
        } catch (error) {
            console.error('Error al obtener las aerolíneas:', error);
            res.status(500).json({ error: 'Error al obtener las aerolíneas' });
        }
    });

    // Iniciar el servidor Express
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
    });
}

main();