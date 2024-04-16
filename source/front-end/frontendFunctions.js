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
