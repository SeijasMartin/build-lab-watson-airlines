const swagger_autogen = require("swagger-autogen")({ openapi: "3.0.0" });

// Define los esquemas de datos
const mongo_specs = {
    Flight: {
        type: "object",
        properties: {
            AIRLINE: {
                type: "string",
            },
            FLIGHT_NUMBER: {
                type: "number",
            },
            ORIGIN_AIRPORT: {
                type: "string",
            },
            DESTINATION_AIRPORT: {
                type: "string",
            },
            CANCELLED: {
                type: "boolean",
            },
            DEPARTURE_DATE: {
                type: "string",
                format: "date-time"
            },
            ARRIVAL_DATE: {
                type: "string",
                format: "date-time"
            },
        },
    },
    Airline: {
        type: "object",
        properties: {
            IATA_CODE: {
                type: "string",
            },
            AIRLINE: {
                type: "string",
            },
        },
    }
};

// Define las características generales de la API
const general_specs = {
    info: {
        title: "Watson Airlines Customer Experience",
        description: "API for managing flights and related data for Watson Airlines.",
        contact: {
            name: "Martín Seijas",
            email: "martinseijas@gmail.com",
        },
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local Server",
        },
        {
            url: "https://backend-88.1fns2dopbijw.us-east.codeengine.appdomain.cloud",
            description: "IBM Code Engine Deployment",
        },
    ],
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    security: [],
    components: {
        schemas: mongo_specs,
    },
};

// Define las rutas de la API
const api_routes = [
    "./app.js",
];

// Define la ubicación del archivo de salida
const output_file_path = "./openapi-spec.json";

// Genera la especificación OpenAPI
swagger_autogen(
    (outputFile = output_file_path),
    (endpointsFiles = api_routes),
    (data = general_specs)
);
