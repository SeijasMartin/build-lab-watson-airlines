async function getAirlinesFromBackend() {
    try {
        const response = await fetch('https://backend-88.1fns2dopbijw.us-east.codeengine.appdomain.cloud/airlines');
        if (!response.ok) {
            throw new Error('Error al obtener las aerolíneas del backend');
        }
        const data = await response.json();
        return data.result; 
    } catch (error) {
        console.error('Error al obtener las aerolíneas:', error);
        throw error;
    }
}
async function getAirportsFromBackend() {
    try {
        const response = await fetch('https://backend-88.1fns2dopbijw.us-east.codeengine.appdomain.cloud/airports');
        if (!response.ok) {
            throw new Error('Error al obtener los aeropuertos del backend');
        }
        const data = await response.json();
        return data.result; 
    } catch (error) {
        console.error('Error al obtener los aeropuertos:', error);
        throw error;
    }
}


async function getFlightsFromBackendORDE(originAirport, destinationAirport) {
    try {
        // Construir la URL del backend
        const backendUrl = `https://backend-88.1fns2dopbijw.us-east.codeengine.appdomain.cloud/flightsORDE?origin_airport=${originAirport}&destination_airport=${destinationAirport}`;

        // Obtener los vuelos desde el backend
        const response = await fetch(backendUrl);
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error al obtener los vuelos:', error);
        throw error;
    }
}

async function getFlightsFromBackendBy(originAirport, destinationAirport, departureDateStart, departureDateEnd, arrivalDate) {
    try {
        // Construir la URL del backend con los parámetros de la consulta
        let backendUrl = `https://backend-88.1fns2dopbijw.us-east.codeengine.appdomain.cloud/flightsBy?`;

        if (originAirport) {
            backendUrl += `origin_airport=${originAirport}&`;
        }

        if (destinationAirport) {
            backendUrl += `destination_airport=${destinationAirport}&`;
        }

        if (departureDateStart && departureDateEnd) {
            backendUrl += `departure_date_start=${departureDateStart}&departure_date_end=${departureDateEnd}&`;
        } else if (departureDateStart) {
            backendUrl += `departure_date_start=${departureDateStart}&`;
        }

        // Eliminar el último '&' de la URL si existe
        if (backendUrl.endsWith('&')) {
            backendUrl = backendUrl.slice(0, -1);
        }

        // Obtener los vuelos desde el backend
        const response = await fetch(backendUrl);
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error al obtener los vuelos:', error);
        throw error;
    }
}
