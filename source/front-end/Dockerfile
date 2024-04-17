# Utiliza la imagen base de Nginx
FROM nginx:latest

# Copia los archivos HTML, CSS y JavaScript al directorio de Nginx
COPY index.html /usr/share/nginx/html
COPY airlines.html /usr/share/nginx/html
COPY airports.html /usr/share/nginx/html
COPY flightsORDE.html /usr/share/nginx/html
COPY flightsBy.html /usr/share/nginx/html
COPY styles.css /usr/share/nginx/html
COPY frontendFunctions.js /usr/share/nginx/html

# Exponer el puerto 80 para que Nginx pueda servir el contenido
EXPOSE 80
